import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { TileChangesService } from '../../services/tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { TileListComponent } from './tile-list.component';

const buildTile = (id: string): Tile => ({
    id,
    order: 0,
    type: TileType.Event,
    title: 'Ausfahrt',
    date: '2026-01-01',
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    status: TileStatus.Open,
    expiration: '',
    behavior: TileBehavior.View,
});

describe('TileListComponent', () => {
    let component: TileListComponent;
    let fixture: ComponentFixture<TileListComponent>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [TileListComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
                { provide: Router, useValue: routerSpy },
                { provide: TilesDataService, useValue: { getTiles: () => of({ items: [], total: 0 }) } },
                { provide: AuthService, useValue: { hasPermission: () => true } },
                { provide: TileChangesService, useValue: { changed$: of() } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TileListComponent);
        component = fixture.componentInstance;
    });

    it('navigates to the modal editor with "neu" on create', () => {
        component.onCreate();
        expect(routerSpy.navigate).toHaveBeenCalledWith([{ outlets: { modal: ['event-bearbeiten', 'neu'] } }]);
    });

    it('navigates to the modal editor with the tile id on edit', () => {
        component.onEdit(buildTile('tile-42'));
        expect(routerSpy.navigate).toHaveBeenCalledWith([{ outlets: { modal: ['event-bearbeiten', 'tile-42'] } }]);
    });
});
