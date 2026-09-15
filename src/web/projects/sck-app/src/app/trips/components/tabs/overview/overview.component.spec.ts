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

    // isTripFull/resolveStatusLabel moved into shared-lib-tile-card (isEventFull/badgeLabel) -
    // see tile-card.component.spec.ts for the capacity/status coverage that used to live here.
    it('should create and load trips', () => {
        setup([makeTrip()]);
        expect(component).toBeTruthy();
        expect(component.allTrips.length).toBe(1);
    });
});
