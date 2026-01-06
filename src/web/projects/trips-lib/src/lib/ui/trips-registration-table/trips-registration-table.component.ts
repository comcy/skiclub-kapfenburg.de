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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TripRegistration } from '../../domain/models/trip-registration';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'lib-trips-registration-table',
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
    templateUrl: './trips-registration-table.component.html',
    styleUrls: ['./trips-registration-table.component.scss'],
})
export class TripsRegistrationTableComponent implements AfterViewInit, OnChanges {
    @Input() registrations$!: Observable<TripRegistration[]>;
    @Input() totalItems!: number;
    @Input() pageSize = 10;
    @Output() sortChange = new EventEmitter<Sort>();
    @Output() filterChange = new EventEmitter<string>();
    @Output() pageChange = new EventEmitter<PageEvent>();
    @Output() delete = new EventEmitter<string>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource = new MatTableDataSource<TripRegistration>();
    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'boarding', 'age', 'action'];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['registrations$']) {
            this.registrations$.subscribe((data) => {
                this.dataSource.data = data;
                if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                }
                if (this.sort) {
                    this.dataSource.sort = this.sort;
                }
            });
        }
        if (changes['totalItems']) {
            if (this.paginator) {
                this.paginator.length = this.totalItems;
            }
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe((sort) => this.sortChange.emit(sort));
        this.paginator.page.subscribe((page) => this.pageChange.emit(page));
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterChange.emit(filterValue.trim().toLowerCase());
    }
}
