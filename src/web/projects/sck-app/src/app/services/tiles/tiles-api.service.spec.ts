/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { environment } from 'projects/sck-app/src/environments/environment';
import { TilesApiService, mapApiTileToTile } from './tiles-api.service';

const BASE_API_TILE = {
    id: 't1',
    order: 1,
    title: 'Title',
    date: '2026-01-01',
    subTitle: 'Sub',
    image: 'img.jpg',
    imageDescription: 'alt',
    description: 'desc',
    status: 'open' as const,
    expiration: '2099-01-01',
    behavior: 'view' as const,
};

describe('mapApiTileToTile', () => {
    it('maps an info tile, passing optional fields through when present', () => {
        const tile = mapApiTileToTile({
            ...BASE_API_TILE,
            type: 'info',
            location: 'Vereinsheim',
            timeData: ['19:00 Uhr'],
        });

        expect(tile.type).toBe(TileType.Info);
        expect(tile.expiration).toBeInstanceOf(Date);
        if (tile.type === TileType.Info) {
            expect(tile.location).toBe('Vereinsheim');
            expect(tile.timeData).toEqual(['19:00 Uhr']);
        }
    });

    it('maps a course tile, defaulting the required GymCourseInformation when the API omits it', () => {
        const tile = mapApiTileToTile({ ...BASE_API_TILE, type: 'course' });

        expect(tile.type).toBe(TileType.Course);
        if (tile.type === TileType.Course) {
            expect(tile.course.name).toBe('Title');
            expect(tile.location).toBe('');
        }
    });

    it('maps an event tile, defaulting tripConfig.pricing to an empty object when the API omits it', () => {
        const tile = mapApiTileToTile({ ...BASE_API_TILE, type: 'event', destination: 'Oberjoch' });

        expect(tile.type).toBe(TileType.Event);
        if (tile.type === TileType.Event) {
            expect(tile.tripConfig).toEqual({ pricing: {} });
            expect(tile.destination).toBe('Oberjoch');
        }
    });

    it('falls back to the current date when the API sends an unparsable expiration', () => {
        const tile = mapApiTileToTile({ ...BASE_API_TILE, type: 'info', expiration: 'not-a-date' });
        expect(isNaN(tile.expiration.getTime())).toBeFalse();
    });
});

describe('TilesApiService', () => {
    let service: TilesApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TilesApiService],
        });
        service = TestBed.inject(TilesApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('getTile resolves the tile matching the given id from the fetched list', () => {
        let result: unknown;
        service.getTile('t1').subscribe((tile) => (result = tile));

        httpMock
            .expectOne((req) => req.url === `${environment.sckApiUrl}/tiles`)
            .flush({ total: 1, items: [{ ...BASE_API_TILE, type: 'info' }] });

        expect((result as { id: string } | undefined)?.id).toBe('t1');
    });
});
