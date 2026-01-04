import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { CourseRegistration } from 'projects/courses-lib/src/lib/domain/models/course-registration';
import { CoursesRegistrationBusinessService } from 'projects/courses-lib/src/lib/services/business/courses-registration-business.service';
import { CoursesUiModule } from 'projects/courses-lib/src/lib/ui/courses-ui.module';
import { CommonModule } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { SiteHeaderComponent } from '@shared/ui-common';

@Component({
    selector: 'app-courses-registration-list',
    standalone: true,
    imports: [CommonModule, CoursesUiModule, SiteHeaderComponent],
    templateUrl: './courses-registration-list.component.html',
    styleUrl: './courses-registration-list.component.scss',
})
export class CoursesRegistrationListComponent implements OnInit {
    private readonly businessService = inject(CoursesRegistrationBusinessService);
    private readonly route = inject(ActivatedRoute);

    public registrations$!: Observable<CourseRegistration[]>;
    public totalItems = 0;
    public eventId!: string;
    public title: string = '';

    private readonly sort = new BehaviorSubject<string | undefined>(undefined);
    private readonly filter = new BehaviorSubject<string | undefined>(undefined);
    private readonly page = new BehaviorSubject<PageEvent>({ pageIndex: 0, pageSize: 10, length: 0 });
    private readonly reload = new BehaviorSubject<void>(undefined);

    ngOnInit(): void {
        const routeParams$ = this.route.paramMap.pipe(
            map((params) => params.get('eventId')),
            tap((eventId) => {
                if (eventId) {
                    this.eventId = eventId;
                }
            }),
        );

        const combined$ = combineLatest([routeParams$, this.sort, this.filter, this.page, this.reload]);

        this.registrations$ = combined$.pipe(
            switchMap(([, sort, filter, page]) =>
                this.businessService
                    .getRegistrations(this.eventId, sort, filter, page.pageIndex + 1, page.pageSize)
                    .pipe(
                        tap(
                            (response) => (
                                (this.totalItems = response.total),
                                (this.title = `Course Registrations: ${response.total}`)
                            ),
                        ),
                        map((response) => response.data),
                    ),
            ),
        );
    }

    onSortChange(sort: Sort): void {
        const sortString = sort.direction ? `${sort.active}:${sort.direction}` : undefined;
        this.sort.next(sortString);
    }

    onFilterChange(filter: string): void {
        this.filter.next(filter);
    }

    onPageChange(page: PageEvent): void {
        this.page.next(page);
    }

    onDelete(id: string): void {
        this.businessService
            .deleteRegistration(this.eventId, id)
            .pipe(tap(() => this.reload.next()))
            .subscribe();
    }
}
