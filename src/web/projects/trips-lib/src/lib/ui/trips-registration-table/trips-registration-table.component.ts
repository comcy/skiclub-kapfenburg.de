import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TripRegistration } from '../../domain/models/trip-registration';

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
export class TripsRegistrationTableComponent implements OnChanges, OnInit {
    @Input() registrations$!: Observable<TripRegistration[]>;
    @Input() totalItems!: number;
    @Input() pageIndex = 0;
    @Input() limit = 10;
    @Input() filter = '';
    @Input() sortDirection: 'asc' | 'desc' = 'asc';
    @Input() sortColumn = 'lastName';

    @Output() pageChange = new EventEmitter<PageEvent>();
    @Output() sortChange = new EventEmitter<Sort>();
    @Output() filterChange = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    private readonly route = inject(ActivatedRoute);

    dataSource = new MatTableDataSource<TripRegistration>();
    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'boarding', 'age', 'action'];

    constructor() {}

    ngOnInit(): void {
        const { page, limit, filter, sortColumn, sortDirection } = this.route.snapshot.queryParams;
        this.pageIndex = page ? page - 1 : this.pageIndex;
        this.limit = limit ?? this.limit;
        this.filter = filter ?? this.filter;
        this.sortColumn = sortColumn ?? this.sortColumn;
        this.sortDirection = sortDirection ?? this.sortDirection;

        this.filterChange.emit(this.filter);
        this.pageChange.emit({
            pageIndex: this.pageIndex,
            pageSize: this.limit,
            length: this.totalItems,
        });
        this.sortChange.emit({
            active: this.sortColumn,
            direction: this.sortDirection,
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['registrations$']) {
            this.registrations$.subscribe((data) => {
                this.dataSource.data = data;
            });
        }
    }

    onSort(sort: Sort): void {
        this.sortChange.emit(sort);
    }

    onFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterChange.emit(filterValue.trim().toLowerCase());
    }

    onPage(page: PageEvent): void {
        this.pageChange.emit(page);
    }
}
