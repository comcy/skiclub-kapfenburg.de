import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CourseRegistration } from '../../domain/models/course-registration';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'lib-courses-registration-table',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './courses-registration-table.component.html',
    styleUrls: ['./courses-registration-table.component.scss'],
})
export class CoursesRegistrationTableComponent implements AfterViewInit, OnChanges {
    @Input() registrations$!: Observable<CourseRegistration[]>;
    @Output() sortChange = new EventEmitter<Sort>();
    @Output() filterChange = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource = new MatTableDataSource<CourseRegistration>();
    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'age', 'level', 'sportType', 'action'];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['registrations$']) {
            this.registrations$.subscribe((data) => {
                this.dataSource.data = data;
                // Re-attach paginator and sort if they are already available
                if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                }
                if (this.sort) {
                    this.dataSource.sort = this.sort;
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe((sort) => this.sortChange.emit(sort));
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterChange.emit(filterValue.trim().toLowerCase());
    }
}
