import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '../../models/tile';
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
    describe('Termin ohne Anmeldung (Event ohne Aktion "register", z. B. Skibörse)', () => {
        it('ist ein Termin nur, wenn actions gesetzt ist und "register" fehlt', () => {
            setup(makeTrip({ actions: [] }));
            expect(component.isAppointment).toBeTrue();
            setup(makeTrip({ actions: [TileActions.Share] }));
            expect(component.isAppointment).toBeTrue();
            setup(makeTrip({ actions: [TileActions.Register] }));
            expect(component.isAppointment).toBeFalse();
            // Alt-Daten ohne actions gelten weiter als anmeldbare Ausfahrt.
            setup(makeTrip({ actions: undefined }));
            expect(component.isAppointment).toBeFalse();
        });

        it('zeigt weder "Plätze frei" noch Anmelden-Button, aber Datum, Beschreibung und Ort', () => {
            setup(
                makeTrip({
                    actions: [],
                    date: '7. November 2026',
                    subTitle: 'Altes Schulhaus Hülen',
                    description: 'Flohmarkt',
                }),
            );
            expect(component.badgeLabel).toBeUndefined();
            expect(component.metaChips).toEqual([]);
            const el: HTMLElement = fixture.nativeElement;
            expect(el.textContent).not.toContain('Anmelden');
            expect(el.querySelector('.eyebrow')?.textContent).toContain('7. November 2026');
            expect(el.querySelector('.description')?.textContent).toContain('Ort: Altes Schulhaus Hülen');
        });

        it('Absage/Warteliste-Badges gelten weiter (Abgesagt)', () => {
            setup(makeTrip({ actions: [], status: TileStatus.Canceled }));
            expect(component.badgeLabel).toBe('Abgesagt');
        });
    });

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
