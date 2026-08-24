import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tile } from '../../domain/tile';
import { TilesDataService } from '../../services/tiles-data.service';
import { TilePreviewComponent } from './tile-preview.component';

describe('TilePreviewComponent', () => {
    let component: TilePreviewComponent;
    let fixture: ComponentFixture<TilePreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TilePreviewComponent],
            providers: [{ provide: TilesDataService, useValue: { apiUrl: 'https://sck-api.example.de/api' } }],
        }).compileComponents();

        fixture = TestBed.createComponent(TilePreviewComponent);
        component = fixture.componentInstance;
    });

    describe('isTripFull (Warteliste-Badge, Runde 2)', () => {
        it('is false when the tile has no capacity set', () => {
            expect(component.isTripFull({ capacity: undefined } as Tile)).toBeFalse();
        });

        it('is false when confirmed registrations are below capacity', () => {
            expect(component.isTripFull({ capacity: 10, confirmedRegistrationsCount: 9 } as Tile)).toBeFalse();
        });

        it('is true once confirmed registrations reach capacity', () => {
            expect(component.isTripFull({ capacity: 10, confirmedRegistrationsCount: 10 } as Tile)).toBeTrue();
        });

        it('is true when confirmed registrations exceed capacity', () => {
            expect(component.isTripFull({ capacity: 10, confirmedRegistrationsCount: 11 } as Tile)).toBeTrue();
        });
    });

    describe('getImageUrl', () => {
        it('returns an empty string for an undefined path', () => {
            expect(component.getImageUrl(undefined)).toBe('');
        });

        it('returns absolute http(s) urls unchanged', () => {
            expect(component.getImageUrl('https://cdn.example.de/x.png')).toBe('https://cdn.example.de/x.png');
        });

        it('prefixes a relative path with the api host (without the /api suffix)', () => {
            expect(component.getImageUrl('/uploads/x.png')).toBe('https://sck-api.example.de/uploads/x.png');
        });
    });
});
