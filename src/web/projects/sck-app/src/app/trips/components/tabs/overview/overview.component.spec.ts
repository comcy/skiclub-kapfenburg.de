/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventTile, TileBehavior, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { of } from 'rxjs';
import { OverviewComponent } from './overview.component';

const makeTrip = (overrides: Partial<EventTile> = {}): EventTile => ({
    id: `trip-${Math.random()}`,
    order: 0,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'Testausfahrt',
    date: '1. Januar 2099',
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    details: '',
    status: TileStatus.Open,
    expiration: new Date('2099-01-02'),
    tripConfig: { pricing: {} },
    ...overrides,
});

describe('OverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;

    const setup = (trips: EventTile[]) => {
        TestBed.configureTestingModule({
            imports: [OverviewComponent],
            providers: [
                provideRouter([]),
                { provide: TripTilesApiServiceInterface, useValue: { getAllTrips: () => of(trips) } },
            ],
        });
        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    describe('isTripFull / resolveStatusLabel (Kapazitäts-Warnung + Warteliste)', () => {
        it('shows "Plätze frei" when open and below capacity', () => {
            setup([makeTrip({ capacity: 10, confirmedRegistrationsCount: 5 })]);
            expect(component.isTripFull(component.allTrips[0])).toBeFalse();
            expect(component.resolveStatusLabel(component.allTrips[0])).toBe('Plätze frei');
        });

        it('shows "Warteliste" once confirmed registrations reach capacity, even though status is still Open', () => {
            setup([makeTrip({ status: TileStatus.Open, capacity: 10, confirmedRegistrationsCount: 10 })]);
            expect(component.isTripFull(component.allTrips[0])).toBeTrue();
            expect(component.resolveStatusLabel(component.allTrips[0])).toBe('Warteliste');
        });

        it('shows "Warteliste" for the manual BookedUp status regardless of capacity', () => {
            setup([makeTrip({ status: TileStatus.BookedUp, capacity: undefined })]);
            expect(component.resolveStatusLabel(component.allTrips[0])).toBe('Warteliste');
        });

        it('shows "Abgesagt" for a canceled trip even when full', () => {
            setup([makeTrip({ status: TileStatus.Canceled, capacity: 1, confirmedRegistrationsCount: 5 })]);
            expect(component.resolveStatusLabel(component.allTrips[0])).toBe('Abgesagt');
        });

        it('never treats a trip without a capacity as full', () => {
            setup([makeTrip({ capacity: undefined, confirmedRegistrationsCount: 999 })]);
            expect(component.isTripFull(component.allTrips[0])).toBeFalse();
        });
    });
});
