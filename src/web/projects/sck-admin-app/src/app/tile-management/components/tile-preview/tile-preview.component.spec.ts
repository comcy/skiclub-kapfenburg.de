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

    describe('Sportkurs-Felder (course.time/location/contact/prices/schedule)', () => {
        const baseTile: Tile = {
            id: 't1',
            order: 0,
            type: 'course',
            title: 'Pilates',
            date: '2026-01-01',
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: 'open',
            expiration: '',
            behavior: 'view',
        } as Tile;

        it('renders no course-info block when tile.course is absent (Ski-/Snowboardkurs)', () => {
            component.tile = baseTile;
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.course-info')).toBeNull();
        });

        it('renders time/location/contact/prices when tile.course is set (Sportkurs)', () => {
            component.tile = {
                ...baseTile,
                course: {
                    name: 'Pilates',
                    description: '',
                    details: '',
                    time: 'Mo 18 Uhr',
                    location: 'Turnhalle',
                    contact: 'info@sck.de',
                    prices: { member: '40 €', nonMember: '60 €' },
                },
            };
            fixture.detectChanges();
            const text = fixture.nativeElement.querySelector('.course-info').textContent;
            expect(text).toContain('Mo 18 Uhr');
            expect(text).toContain('Turnhalle');
            expect(text).toContain('info@sck.de');
            expect(text).toContain('40 €');
            expect(text).toContain('60 €');
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
