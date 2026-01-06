import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { SiteHeaderComponent } from '@shared/ui-common';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, tap } from 'rxjs';
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
export class CoursesRegistrationListComponent implements OnInit {
    private readonly businessService = inject(CoursesRegistrationBusinessService);
    private readonly storageKey = 'course-registration-table-limit';

    public registrations$!: Observable<CourseRegistration[]>;
    public totalItems = 0;
    public title: string = '';
    public initialPageSize: number;

    private readonly sort = new BehaviorSubject<string | undefined>(undefined);
    private readonly filter = new BehaviorSubject<string | undefined>(undefined);
    private readonly page: BehaviorSubject<PageEvent>;
    private readonly sportType = new BehaviorSubject<string | undefined>(undefined);
    private readonly reload = new BehaviorSubject<void>(undefined);

    constructor() {
        const storedLimit = sessionStorage.getItem(this.storageKey);
        this.initialPageSize = storedLimit ? parseInt(storedLimit, 10) : 10;
        this.page = new BehaviorSubject<PageEvent>({ pageIndex: 0, pageSize: this.initialPageSize, length: 0 });
    }

    ngOnInit(): void {
        const combined$ = combineLatest([this.sort, this.filter, this.page, this.sportType, this.reload]);

        this.registrations$ = combined$.pipe(
            switchMap(([sort, filter, page, sportType]) =>
                this.businessService.getRegistrations(sort, filter, page.pageIndex + 1, page.pageSize, sportType).pipe(
                    tap(
                        (response) => (
                            (this.totalItems = response.total), (this.title = `Course Registrations: ${response.total}`)
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
        sessionStorage.setItem(this.storageKey, page.pageSize.toString());
        this.page.next(page);
    }

    onSportTypeChange(sportType: string): void {
        this.sportType.next(sportType);
    }

    onDelete(id: string): void {
        this.businessService
            .deleteRegistration(id)
            .pipe(tap(() => this.reload.next()))
            .subscribe();
    }
}
