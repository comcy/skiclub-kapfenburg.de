import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TileType, TileBehavior, TileActions } from 'projects/shared-lib/src/lib/ui-common/models';
import { STATIC_DATA } from 'projects/data/static-data';

describe('HomeComponent (domain scenarios)', () => {
    let component: HomeComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [HomeComponent] }).compileComponents();
        const fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should include membership and pilates tiles from STATIC_DATA', () => {
        const titles = component.tiles.map((t) => t.title);
        STATIC_DATA.forEach((sd) => expect(titles).toContain(sd.title));
    });

    it('should mark no current static tiles as expired (future expirations)', () => {
        const staticTitles = STATIC_DATA.map((s) => s.title);
        const staticTiles = component.tiles.filter((t) => staticTitles.includes(t.title));
        staticTiles.forEach((t) => expect(t.expired).toBeFalse());
    });

    it('course tiles should use Course type and contain Register action', () => {
        const courseTiles = component.tiles.filter((t) => t.type === TileType.Course);
        courseTiles.forEach((t) => expect(t.actions).toContain(TileActions.Register));
    });

    it('info tiles should not have Register action', () => {
        const infoTiles = component.tiles.filter((t) => t.type !== TileType.Course);
        infoTiles.forEach((t) => expect(t.actions ?? []).not.toContain(TileActions.Register));
    });

    it('click behavior tiles (membership) have a download link when action is Download', () => {
        const clickTiles = component.tiles.filter((t) => t.behavior === TileBehavior.Click);
        clickTiles.forEach((t) => {
            if ((t.actions ?? []).includes(TileActions.Download)) {
                expect(t.downloadActionLink).toBeTruthy();
            }
        });
    });
});
