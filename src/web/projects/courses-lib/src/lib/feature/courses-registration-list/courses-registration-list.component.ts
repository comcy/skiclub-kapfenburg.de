import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteHeaderComponent } from '@shared/ui-common';
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
import { CourseRegistration } from '../../domain/models/course-registration';
import { CoursesRegistrationBusinessService } from '../../services/business/courses-registration-business.service';
import { CoursesUiModule } from '../../ui/courses-ui.module';

@Component({
    selector: 'lib-courses-registration-list',
    standalone: true,
    imports: [CommonModule, CoursesUiModule, MatFormFieldModule, MatSelectModule, SiteHeaderComponent],
    templateUrl: './courses-registration-list.component.html',
    styleUrl: './courses-registration-list.component.scss',
})
export class CoursesRegistrationListComponent implements OnInit, OnDestroy {
    private readonly businessService = inject(CoursesRegistrationBusinessService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private readonly filter$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();

    public registrations$!: Observable<CourseRegistration[]>;
    public totalItems = 0;
    public title = 'Course Registrations';
    public page = 1;
    public limit = 10;
    public filter = '';
    public sortDirection: 'asc' | 'desc' = 'asc';
    public sortColumn = 'lastName';

    private readonly page$ = new BehaviorSubject<PageEvent>({
        pageIndex: this.page - 1,
        pageSize: this.limit,
        length: 0,
    });

    private readonly sort$ = new BehaviorSubject<Sort>({
        active: this.sortColumn,
        direction: this.sortDirection,
    });

    private readonly sportType$ = new BehaviorSubject<string | undefined>(undefined);
    private readonly reload$ = new BehaviorSubject<void>(undefined);

    ngOnInit(): void {
        const { page, limit, filter, sortColumn, sortDirection } = this.route.snapshot.queryParams;
        this.page = page ? parseInt(page) : this.page;
        this.limit = limit ? parseInt(limit) : this.limit;
        this.filter = filter ?? this.filter;
        this.sortColumn = sortColumn ?? this.sortColumn;
        this.sortDirection = sortDirection ?? this.sortDirection;

        this.page$.next({ pageIndex: this.page - 1, pageSize: this.limit, length: this.totalItems });
        this.sort$.next({ active: this.sortColumn, direction: this.sortDirection });

        const combined$ = combineLatest([this.page$, this.sort$, this.sportType$, this.reload$]);

        this.registrations$ = combined$.pipe(
            switchMap(([page, sort, sportType]) =>
                this.businessService
                    .getRegistrations(
                        `${sort.active}:${sort.direction}`,
                        this.filter,
                        page.pageIndex + 1,
                        page.pageSize,
                        sportType,
                    )
                    .pipe(
                        tap((response) => {
                            this.totalItems = response.total;
                            this.title = `Course Registrations: ${response.total}`;
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

    onSportTypeChange(sportType: string): void {
        this.page$.next({ pageIndex: 0, pageSize: this.limit, length: this.totalItems });
        this.sportType$.next(sportType);
        this.updateUrl();
    }

    onDelete(id: string): void {
        this.businessService
            .deleteRegistration(id)
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
                sportType: this.sportType$.value,
            },
            queryParamsHandling: 'merge',
        });
    }
}
