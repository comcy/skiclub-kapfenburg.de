/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { CoursesFeatureModule } from '@courses-lib';
import { COURSE_DATA, PROGRAMM_DOWNLOAD_LINK, STATIC_DATA } from '@data';
import { CourseTilesApiServiceInterface } from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { mergeCourseTile } from 'projects/courses-lib/src/lib/domain/merge-course-tile';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { GymFeatureModule } from '@gym-lib';
import { GymCourseSchedule } from 'projects/gym-lib/src/lib/domain';
import { GYM_GENERAL_OFFERS } from 'projects/data/static';
import { MarkdownRenderService } from '@shared/util-markdown';
import { TripsFeatureModule } from '@trips-lib';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import {
    CourseTile,
    EventTile,
    InfoTile,
    Tile,
    TileActions,
    TileBehavior,
    TileStatus,
    TileType,
} from 'projects/shared-lib/src/lib/ui-common/models';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';
import { combineLatest } from 'rxjs';
import { GYM_ROUTE, TRIPS_ROUTE } from '../../route-segments';

interface CalendarDayEvent {
    title: string;
    type: 'trip' | 'course';
    /** Present only for events with their own detail page (trips, bookable courses). */
    id?: string;
}

interface CarouselSlide {
    id: string;
    kind: 'static' | 'trip' | 'course';
    image?: string;
    imageAlt?: string;
    badge: string;
    badgeWarn: boolean;
    eyebrow: string;
    title: string;
    descriptionHtml: string;
    priceLabelHtml?: string;
    ctaLabel: string;
    ctaColor: 'primary' | 'accent';
    onClick: () => void;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CommonModule,
        RouterModule,
        ComponentsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatSliderModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        CoursesFeatureModule,
        GymFeatureModule,
        TripsFeatureModule,
    ],
})
export class HomeComponent implements OnInit, OnDestroy {
    public title = 'Aktuelles';
    public tileStatusEnum = TileStatus;
    public tileActionsEnum = TileActions;
    public tileBehaviorEnum = TileBehavior;
    public tileTypeEnum = TileType;
    public registerLabel = 'Anmelden';
    public tiles: Tile[] = [];
    public programmDownloadLink = PROGRAMM_DOWNLOAD_LINK;

    /** Next upcoming trips, teased on the home page; full list lives on the Ausfahrten overview tab. */
    public upcomingTrips: EventTile[] = [];
    public courseTiles: CourseTile[] = [];
    public infoTiles: InfoTile[] = [];

    public calendarMonth = new Date();
    public calendarGrid: Date[][] = [];
    public calendarWeekdayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    private calendarEvents = new Map<string, CalendarDayEvent[]>();

    public carouselSlides: CarouselSlide[] = [];
    public carouselIndex = 0;
    private carouselTimer?: ReturnType<typeof setInterval>;

    private courses = COURSE_DATA;
    private staticData = STATIC_DATA;

    public router = inject(Router);
    public markdown = inject(MarkdownRenderService);
    private tripsApi = inject(TripTilesApiServiceInterface);
    private courseTilesApi = inject(CourseTilesApiServiceInterface);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        combineLatest([this.tripsApi.getAllTrips(), this.courseTilesApi.getAllCourseTiles()]).subscribe(
            ([trips, apiCourseTiles]) => {
                const mergedCourses = this.courses
                    .filter((t): t is CourseTile => t.type === TileType.Course)
                    .map((course) => {
                        const match = apiCourseTiles.find((t) => t.title === course.course.name);
                        return mergeCourseTile(course, match);
                    });
                const homeTiles: Tile[] = [...mergedCourses, ...this.staticData, ...trips];

                homeTiles.sort((a, b) => {
                    return a.order > b.order // Handle order
                        ? -1
                        : b.expiration.getTime() - a.expiration.getTime(); // Handle expiration
                });

                // then place expired events at the end (stable: keeps the previous ordering within each group)
                const now = new Date().getTime();
                homeTiles.sort((a, b) => {
                    const aExpired = a.expiration.getTime() < now;
                    const bExpired = b.expiration.getTime() < now;
                    if (aExpired === bExpired) return 0;
                    return aExpired ? 1 : -1;
                });

                homeTiles.map((t) => {
                    t.expired = t.expiration.getTime() < new Date().getTime() ? true : false;
                    t.visible = t.visible === false ? false : true;
                });

                this.tiles = homeTiles;

                this.upcomingTrips = homeTiles
                    .filter((t): t is EventTile => t.type === TileType.Event && !t.expired)
                    .sort((a, b) => a.expiration.getTime() - b.expiration.getTime())
                    .slice(0, 3);
                this.courseTiles = homeTiles.filter((t): t is CourseTile => t.type === TileType.Course);
                this.infoTiles = homeTiles.filter((t): t is InfoTile => t.type === TileType.Info);

                const openTrips = homeTiles.filter((t): t is EventTile => t.type === TileType.Event && !t.expired);

                this.calendarEvents = this.buildCalendarEvents(openTrips, this.courseTiles);
                this.calendarGrid = this.buildCalendarGrid(this.calendarMonth);

                this.carouselSlides = [
                    this.buildStaticSlide(),
                    ...openTrips.map((trip) => this.buildTripSlide(trip)),
                    ...this.courseTiles.map((course) => this.buildCourseSlide(course)),
                ];
                if (this.carouselSlides.length > 1) {
                    this.startCarouselAutoplay();
                }
                this.cdr.markForCheck();
            },
        );
    }

    ngOnDestroy(): void {
        this.pauseCarousel();
    }

    public resolvePrice(trip: EventTile): number | undefined {
        return trip.tripConfig?.pricing?.busLift?.adult?.member;
    }

    // Only ever true for API-backed tiles (capacity/confirmedRegistrationsCount
    // are undefined on the static TRIP_DATA fallback) - an independent,
    // automatic signal alongside the admin's manual BookedUp status.
    public isTripFull(trip: EventTile): boolean {
        return !!trip.capacity && (trip.confirmedRegistrationsCount ?? 0) >= trip.capacity;
    }

    // CALENDAR

    public prevMonth(): void {
        this.calendarMonth = subMonths(this.calendarMonth, 1);
        this.calendarGrid = this.buildCalendarGrid(this.calendarMonth);
    }

    public nextMonth(): void {
        this.calendarMonth = addMonths(this.calendarMonth, 1);
        this.calendarGrid = this.buildCalendarGrid(this.calendarMonth);
    }

    public isSameMonthAsCalendar(day: Date): boolean {
        return isSameMonth(day, this.calendarMonth);
    }

    public getDayEvents(day: Date): CalendarDayEvent[] {
        return this.calendarEvents.get(format(day, 'yyyy-MM-dd')) ?? [];
    }

    public dayTooltip(day: Date): string {
        return this.getDayEvents(day)
            .map((event) => `${event.type === 'trip' ? 'Ausfahrt' : 'Kurs'}: ${event.title}`)
            .join('\n');
    }

    public hasCourseEvent(day: Date): boolean {
        return this.getDayEvents(day).some((event) => event.type === 'course');
    }

    public hasTripEvent(day: Date): boolean {
        return this.getDayEvents(day).some((event) => event.type === 'trip');
    }

    public isDayClickable(day: Date): boolean {
        return this.getDayEvents(day).some((event) => !!event.id);
    }

    public onDayClick(day: Date): void {
        const target = this.getDayEvents(day).find((event) => !!event.id);
        if (!target?.id) {
            return;
        }
        this.router.navigate([target.type === 'trip' ? TRIPS_ROUTE : GYM_ROUTE, target.id]);
    }

    private buildCalendarGrid(month: Date): Date[][] {
        const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }

    private buildCalendarEvents(trips: EventTile[], courses: CourseTile[]): Map<string, CalendarDayEvent[]> {
        const map = new Map<string, CalendarDayEvent[]>();
        const addEvent = (date: Date, title: string, type: CalendarDayEvent['type'], id?: string) => {
            const key = format(date, 'yyyy-MM-dd');
            const list = map.get(key) ?? [];
            list.push({ title, type, id });
            map.set(key, list);
        };

        trips.forEach((trip) => addEvent(trip.expiration, trip.title, 'trip', trip.id));
        courses.forEach((course) => {
            const schedule = course.course?.schedule;
            if (!schedule) {
                return;
            }
            this.computeCourseSessionDates(schedule).forEach((date) =>
                addEvent(date, course.title, 'course', course.id),
            );
        });
        // Public, non-bookable Gymnastik sessions (Fitness Cocktail, Fitnessmix, Vitalgymnastik) -
        // calendar-only, no detail page/registration, so no id.
        GYM_GENERAL_OFFERS.forEach((offer) => {
            if (!offer.schedule) {
                return;
            }
            this.computeCourseSessionDates(offer.schedule).forEach((date) =>
                addEvent(date, `${offer.name} (${offer.time})`, 'course'),
            );
        });

        return map;
    }

    private computeCourseSessionDates(schedule: GymCourseSchedule): Date[] {
        return eachDayOfInterval({ start: schedule.startDate, end: schedule.endDate })
            .filter((date) => date.getDay() === schedule.weekday)
            .filter((date) => !(schedule.excludedDates ?? []).some((excluded) => isSameDay(excluded, date)));
    }

    // CAROUSEL

    public nextSlide(): void {
        if (this.carouselSlides.length === 0) {
            return;
        }
        this.carouselIndex = (this.carouselIndex + 1) % this.carouselSlides.length;
    }

    public prevSlide(): void {
        if (this.carouselSlides.length === 0) {
            return;
        }
        this.carouselIndex = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
    }

    public goToSlide(index: number): void {
        this.carouselIndex = index;
    }

    public pauseCarousel(): void {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = undefined;
        }
    }

    public resumeCarousel(): void {
        if (!this.carouselTimer && this.carouselSlides.length > 1) {
            this.startCarouselAutoplay();
        }
    }

    private startCarouselAutoplay(): void {
        this.carouselTimer = setInterval(() => this.nextSlide(), 6000);
    }

    private buildStaticSlide(): CarouselSlide {
        return {
            id: 'ski-snowboard-school',
            kind: 'static',
            image: 'assets/img/cards/boy.jpg',
            imageAlt: 'Ski- und Snowboardschule am Skilift Kapfenburg',
            badge: 'Alle Level',
            badgeWarn: false,
            eyebrow: 'Nach Schneelage',
            title: 'Ski- & Snowboardschule',
            descriptionHtml: 'Für Kinder und Erwachsene, alle Könnerstufen, direkt am Skilift Kapfenburg.',
            priceLabelHtml: 'Kontakt &amp; Termine',
            ctaLabel: 'Mehr erfahren',
            ctaColor: 'accent',
            onClick: () => this.router.navigate(['/courses']),
        };
    }

    private buildTripSlide(trip: EventTile): CarouselSlide {
        const price = this.resolvePrice(trip);
        const isWaitlisted = trip.status === TileStatus.BookedUp || this.isTripFull(trip);
        return {
            id: trip.id,
            kind: 'trip',
            image: trip.image,
            imageAlt: trip.imageDescription,
            badge: isWaitlisted ? 'Warteliste' : 'Plätze frei',
            badgeWarn: isWaitlisted,
            eyebrow: trip.date,
            title: trip.title,
            descriptionHtml: trip.destination ?? '',
            priceLabelHtml: price ? `ab <b>${price}&nbsp;€</b>` : undefined,
            ctaLabel: 'Anmelden',
            ctaColor: 'primary',
            onClick: () => this.openTripDetail(trip),
        };
    }

    private buildCourseSlide(course: CourseTile): CarouselSlide {
        return {
            id: course.id,
            kind: 'course',
            image: course.image,
            imageAlt: course.imageDescription,
            badge: course.title.includes('Donnerstag') ? 'Donnerstags' : 'Mittwochs',
            badgeWarn: false,
            eyebrow: course.subTitle,
            title: course.title,
            descriptionHtml: this.markdown.render(this.getTileDescription(course)),
            priceLabelHtml: course.course?.prices?.member ? `ab <b>${course.course.prices.member}</b>` : undefined,
            ctaLabel: 'Anmelden',
            ctaColor: 'accent',
            onClick: () => this.openCourseDetail(course),
        };
    }

    public openRegisterDialog(tile: Tile) {
        this.router.navigate([{ outlets: { modal: ['register', tile.id] } }]);
    }

    public openTripDetail(tile: Tile): void {
        this.router.navigate([TRIPS_ROUTE, tile.id]);
    }

    public openCourseDetail(tile: Tile): void {
        this.router.navigate([GYM_ROUTE, tile.id]);
    }

    public openLink(link: string | undefined) {
        if (link) {
            window.open(link, '_blank');
        }
    }

    /**
     * Builds the description markdown for non-trip tiles (info tiles get
     * their location/timeData appended). Trip (Event) tiles no longer render
     * inline on the home tile - their full description now lives on the
     * trip detail page (TripDetailComponent in trips-lib), which builds its
     * own event-specific markdown (destination, boardings, pricing table).
     */
    public getTileDescription(tile: Tile): string {
        if (tile.type === TileType.Info) {
            const infoTile = tile as InfoTile;
            let content = tile.description || '';
            if (infoTile.location) {
                content += `\n\n**Ort:** ${infoTile.location}\n`;
            }
            if (infoTile.timeData && infoTile.timeData.length > 0) {
                content += '\n\n**Zeiten**\n\n';
                infoTile.timeData.forEach((time) => {
                    content += `- ${time}\n`;
                });
            }
            return content;
        }

        return tile.description;
    }
}
