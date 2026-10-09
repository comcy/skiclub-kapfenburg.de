import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';
import { RegistrationsOverviewComponent } from './registrations-overview.component';

const makeTile = (overrides: Partial<Tile> = {}): Tile => ({
    id: `tile-${Math.random()}`,
    order: 0,
    type: TileType.Event,
    title: 'Testausfahrt',
    date: '1. Januar 2099',
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    status: TileStatus.Open,
    expiration: '2099-01-01T00:00:00.000Z',
    behavior: TileBehavior.View,
    ...overrides,
});

describe('RegistrationsOverviewComponent', () => {
    let component: RegistrationsOverviewComponent;
    let fixture: ComponentFixture<RegistrationsOverviewComponent>;

    const setup = (tiles: Tile[]) => {
        TestBed.configureTestingModule({
            imports: [RegistrationsOverviewComponent],
            providers: [
                provideRouter([]),
                { provide: TilesDataService, useValue: { getTiles: () => of({ items: tiles, total: tiles.length }) } },
            ],
        });
        fixture = TestBed.createComponent(RegistrationsOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('sorts upcoming tiles before expired ones, both by ascending date within their group', () => {
        setup([
            makeTile({ id: 'a', title: 'A', expiration: '2099-03-01T00:00:00.000Z', expired: false }),
            makeTile({ id: 'b', title: 'B', expiration: '2020-01-01T00:00:00.000Z', expired: true }),
            makeTile({ id: 'c', title: 'C', expiration: '2099-01-01T00:00:00.000Z', expired: false }),
            makeTile({ id: 'd', title: 'D', expiration: '2021-01-01T00:00:00.000Z', expired: true }),
        ]);

        expect(component.tiles.map((t) => t.id)).toEqual(['c', 'a', 'b', 'd']);
    });

    it('isOverCapacity is true once confirmedRegistrationsCount reaches capacity, false when unlimited', () => {
        setup([]);

        expect(component.isOverCapacity(makeTile({ capacity: 10, confirmedRegistrationsCount: 10 }))).toBeTrue();
        expect(component.isOverCapacity(makeTile({ capacity: 10, confirmedRegistrationsCount: 9 }))).toBeFalse();
        expect(
            component.isOverCapacity(makeTile({ capacity: undefined, confirmedRegistrationsCount: 999 })),
        ).toBeFalse();
    });

    it('resolveStatusLabel prioritizes Abgesagt, then Warteliste (manual or capacity-derived), then Offen', () => {
        setup([]);

        expect(
            component.resolveStatusLabel(
                makeTile({ status: TileStatus.Canceled, capacity: 1, confirmedRegistrationsCount: 5 }),
            ),
        ).toBe('Abgesagt');
        expect(component.resolveStatusLabel(makeTile({ status: TileStatus.BookedUp }))).toBe('Warteliste');
        expect(
            component.resolveStatusLabel(
                makeTile({ status: TileStatus.Open, capacity: 2, confirmedRegistrationsCount: 2 }),
            ),
        ).toBe('Warteliste');
        expect(
            component.resolveStatusLabel(
                makeTile({ status: TileStatus.Open, capacity: 2, confirmedRegistrationsCount: 1 }),
            ),
        ).toBe('Offen');
    });

    it('shows the empty state once loaded with no tiles', () => {
        setup([]);

        expect(component.loaded).toBeTrue();
        expect(component.tiles).toEqual([]);
        expect(fixture.nativeElement.textContent).toContain('Noch keine Ausfahrten angelegt.');
    });
});
