import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TileChangesService } from '../../services/tile-changes.service';
import { PaginatedResponse } from '../../domain/paginated-response';
import { TilesDataService } from '../../services/tiles-data.service';
import { CourseTileListComponent } from './course-tile-list.component';

const buildTile = (overrides: Partial<Tile> = {}): Tile => ({
    id: `tile-${Math.random()}`,
    order: 0,
    type: TileType.Course,
    title: 'Kurs',
    date: '2026-01-01',
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    status: TileStatus.Open,
    expiration: '',
    behavior: TileBehavior.View,
    ...overrides,
});

describe('CourseTileListComponent', () => {
    let fixture: ComponentFixture<CourseTileListComponent>;
    let dataServiceSpy: jasmine.SpyObj<TilesDataService>;

    const setup = (courseKind: 'sport' | 'ski', tiles: Tile[]) => {
        dataServiceSpy = jasmine.createSpyObj<TilesDataService>('TilesDataService', ['getTiles', 'deleteTile']);
        dataServiceSpy.getTiles.and.returnValue(of({ items: tiles, total: tiles.length } as PaginatedResponse<Tile>));

        TestBed.configureTestingModule({
            imports: [CourseTileListComponent],
            providers: [
                { provide: TilesDataService, useValue: dataServiceSpy },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: TileChangesService, useValue: { changed$: of() } },
                { provide: AuthService, useValue: { hasPermission: () => true } },
                { provide: ActivatedRoute, useValue: { snapshot: { data: { courseKind } } } },
            ],
        });
        fixture = TestBed.createComponent(CourseTileListComponent);
        fixture.detectChanges();
    };

    it('shows only tiles with tile.course set for courseKind "sport"', () => {
        const withCourse = buildTile({
            id: 'a',
            course: { name: '', description: '', details: '', time: '', location: '', contact: '' },
        });
        const withoutCourse = buildTile({ id: 'b' });
        setup('sport', [withCourse, withoutCourse]);

        expect(fixture.componentInstance.pagedTiles.map((t) => t.id)).toEqual(['a']);
    });

    it('shows only tiles without tile.course for courseKind "ski"', () => {
        const withCourse = buildTile({
            id: 'a',
            course: { name: '', description: '', details: '', time: '', location: '', contact: '' },
        });
        const withoutCourse = buildTile({ id: 'b' });
        setup('ski', [withCourse, withoutCourse]);

        expect(fixture.componentInstance.pagedTiles.map((t) => t.id)).toEqual(['b']);
    });
});
