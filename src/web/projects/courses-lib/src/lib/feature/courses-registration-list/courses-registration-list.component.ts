import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { CourseRegistration } from '../../domain/models/course-registration';
import { CoursesRegistrationBusinessService } from '../../services/business/courses-registration-business.service';
import { CoursesUiModule } from '../../ui/courses-ui.module';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'lib-courses-registration-list',
    standalone: true,
    imports: [CommonModule, CoursesUiModule], // Add CommonModule here
    templateUrl: './courses-registration-list.component.html',
    styleUrl: './courses-registration-list.component.scss',
})
export class CoursesRegistrationListComponent implements OnInit {
    private readonly businessService = inject(CoursesRegistrationBusinessService);
    public registrations$!: Observable<CourseRegistration[]>;

    private readonly sort = new BehaviorSubject<string | undefined>(undefined);
    private readonly filter = new BehaviorSubject<string | undefined>(undefined);
    private readonly reload = new BehaviorSubject<void>(undefined);

    ngOnInit(): void {
        this.registrations$ = this.reload.pipe(
            switchMap(() =>
                this.sort.pipe(
                    switchMap((sort) =>
                        this.filter.pipe(
                            switchMap((filter) =>
                                this.businessService
                                    .getRegistrations(sort, filter)
                                    .pipe(map((response) => response.data)),
                            ),
                        ),
                    ),
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

    onDelete(id: string): void {
        this.businessService
            .deleteRegistration(id)
            .pipe(tap(() => this.reload.next()))
            .subscribe();
    }
}
