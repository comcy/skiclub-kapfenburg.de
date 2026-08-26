import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CourseTileChangesService } from '../../services/course-tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { CourseTileEditRoutingDialogComponent } from './course-tile-edit-routing-dialog.component';

describe('CourseTileEditRoutingDialogComponent', () => {
    let fixture: ComponentFixture<CourseTileEditRoutingDialogComponent>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    const setup = (courseKind: 'sport' | 'ski', id = 'neu') => {
        dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as never);

        TestBed.configureTestingModule({
            imports: [CourseTileEditRoutingDialogComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                {
                    provide: TilesDataService,
                    useValue: jasmine.createSpyObj<TilesDataService>('TilesDataService', ['getTile']),
                },
                { provide: CourseTileChangesService, useValue: { notifyChanged: () => {} } },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: convertToParamMap({ id }), data: { courseKind } },
                        parent: null,
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(CourseTileEditRoutingDialogComponent);
        fixture.detectChanges();
    };

    it('seeds tile.course for a new Sportkurs (replaces the old checkbox)', () => {
        setup('sport');

        const data = dialogSpy.open.calls.mostRecent().args[1]?.data as { tile: { course?: unknown } };
        expect(data.tile.course).toBeDefined();
    });

    it('does not seed tile.course for a new Ski-/Snowboardkurs', () => {
        setup('ski');

        const data = dialogSpy.open.calls.mostRecent().args[1]?.data as { tile: { course?: unknown } };
        expect(data.tile.course).toBeUndefined();
    });
});
