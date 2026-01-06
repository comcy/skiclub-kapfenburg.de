import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
    debounceTime,
    map,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { TripRegistration } from '../../domain/models/trip-registration';
import { TripsRegistrationBusinessService } from '../../services/business/trips-registration-business.service';
import { TripsUiModule } from '../../ui/trips-ui.module';
import { CommonModule } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { SiteHeaderComponent } from '@shared/ui-common';

@Component({
    selector: 'lib-trips-registration-list',
    standalone: true,
    imports: [CommonModule, TripsUiModule, SiteHeaderComponent],
    templateUrl: './trips-registration-list.component.html',
    styleUrl: './trips-registration-list.component.scss',
})
export class TripsRegistrationListComponent implements OnInit, OnDestroy {
    private readonly businessService = inject(TripsRegistrationBusinessService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private readonly filter$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();

    public registrations$!: Observable<TripRegistration[]>;
    public totalItems = 0;
    public page = 1;
    public limit = 10;
    public filter = '';
    public sortDirection: 'asc' | 'desc' = 'asc';
    public sortColumn = 'lastName';
    public eventId!: string;
    public title = 'Trip Registrations';

    private readonly page$ = new BehaviorSubject<PageEvent>({
        pageIndex: this.page - 1,
        pageSize: this.limit,
        length: 0,
    });

    private readonly sort$ = new BehaviorSubject<Sort>({
        active: this.sortColumn,
        direction: this.sortDirection,
    });

    private readonly reload$ = new BehaviorSubject<void>(undefined);

    ngOnInit(): void {
        const { page, limit, filter, sortColumn, sortDirection } = this.route.snapshot.queryParams;
        this.page = page ? parseInt(page) : this.page;
        this.limit = limit ? parseInt(limit) : this.limit;
        this.filter = filter ?? this.filter;
        this.sortColumn = sortColumn ?? this.sortColumn;
        this.sortDirection = sortDirection ?? this.sortDirection;

        const routeParams$ = this.route.paramMap.pipe(
            map((params) => params.get('eventId')),
            tap((eventId) => {
                if (eventId) {
                    this.eventId = eventId;
                }
            }),
        );
        this.page$.next({ pageIndex: this.page - 1, pageSize: this.limit, length: this.totalItems });
        this.sort$.next({ active: this.sortColumn, direction: this.sortDirection });

        const combined$ = combineLatest([routeParams$, this.page$, this.sort$, this.reload$]);

        this.registrations$ = combined$.pipe(
            switchMap(([, page, sort]) =>
                this.businessService
                    .getRegistrations(
                        this.eventId,
                        `${sort.active}:${sort.direction}`,
                        this.filter,
                        page.pageIndex + 1,
                        page.pageSize,
                    )
                    .pipe(
                        tap((response) => {
                            this.totalItems = response.total;
                            this.title = `Trip Registrations: ${response.total}`;
                        }),
                        map((response) => response.data),
                    ),
            ),
        );

        this.filter$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((filter) => {
            this.filter = filter;
            this.reload$.next();
            this.updateUrl();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSortChange(sort: Sort): void {
        this.page$.next({ pageIndex: 0, pageSize: this.limit, length: this.totalItems });
        this.sort$.next(sort);
        this.updateUrl();
    }

    onFilterChange(filter: string): void {
        this.page$.next({ pageIndex: 0, pageSize: this.limit, length: this.totalItems });
        this.filter$.next(filter);
    }

    onPageChange(page: PageEvent): void {
        this.page$.next(page);
        this.updateUrl();
    }

    onDelete(id: string): void {
        this.businessService
            .deleteRegistration(this.eventId, id)
            .pipe(tap(() => this.reload$.next()))
            .subscribe();
    }

    private updateUrl(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                page: this.page$.value.pageIndex + 1,
                limit: this.page$.value.pageSize,
                filter: this.filter,
                sortColumn: this.sort$.value.active,
                sortDirection: this.sort$.value.direction,
            },
            queryParamsHandling: 'merge',
        });
    }
}
