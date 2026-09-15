import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventTile, TileBehavior, TileStatus, TileType } from '../../models/tile';
import { TileCardComponent } from './tile-card.component';

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

describe('TileCardComponent', () => {
    let component: TileCardComponent;
    let fixture: ComponentFixture<TileCardComponent>;

    const setup = (tile: EventTile) => {
        fixture = TestBed.createComponent(TileCardComponent);
        component = fixture.componentInstance;
        component.tile = tile;
        fixture.detectChanges();
    };

    // Ported from the former isTripFull/resolveStatusLabel tests on
    // OverviewComponent/HomeComponent - the logic moved here so it's tested
    // once, for every page that renders an EventTile card.
    describe('isEventFull / badgeLabel (Kapazitäts-Warnung + Warteliste)', () => {
        it('shows "Plätze frei" when open and below capacity', () => {
            setup(makeTrip({ capacity: 10, confirmedRegistrationsCount: 5 }));
            expect(component.isEventFull).toBeFalse();
            expect(component.badgeLabel).toBe('Plätze frei');
        });

        it('shows "Warteliste" once confirmed registrations reach capacity, even though status is still Open', () => {
            setup(makeTrip({ status: TileStatus.Open, capacity: 10, confirmedRegistrationsCount: 10 }));
            expect(component.isEventFull).toBeTrue();
            expect(component.badgeLabel).toBe('Warteliste');
        });

        it('shows "Warteliste" for the manual BookedUp status regardless of capacity', () => {
            setup(makeTrip({ status: TileStatus.BookedUp, capacity: undefined }));
            expect(component.badgeLabel).toBe('Warteliste');
        });

        it('shows "Abgesagt" for a canceled trip even when full', () => {
            setup(makeTrip({ status: TileStatus.Canceled, capacity: 1, confirmedRegistrationsCount: 5 }));
            expect(component.badgeLabel).toBe('Abgesagt');
        });

        it('never treats a trip without a capacity as full', () => {
            setup(makeTrip({ capacity: undefined, confirmedRegistrationsCount: 999 }));
            expect(component.isEventFull).toBeFalse();
        });
    });
});
