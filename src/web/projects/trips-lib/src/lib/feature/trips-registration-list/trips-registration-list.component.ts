import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { TripRegistration } from '../../domain/models/trip-registration';
import { TripsRegistrationBusinessService } from '../../services/business/trips-registration-business.service';
import { TripsUiModule } from '../../ui/trips-ui.module';
import { CommonModule } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'lib-trips-registration-list',
    standalone: true,
    imports: [CommonModule, TripsUiModule],
    templateUrl: './trips-registration-list.component.html',
    styleUrl: './trips-registration-list.component.scss',
})
export class TripsRegistrationListComponent implements OnInit {
    private readonly businessService = inject(TripsRegistrationBusinessService);
    private readonly route = inject(ActivatedRoute);

    public registrations$!: Observable<TripRegistration[]>;
    public totalItems = 0;
    public eventId!: string;

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
                        tap((response) => (this.totalItems = response.total)),
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
