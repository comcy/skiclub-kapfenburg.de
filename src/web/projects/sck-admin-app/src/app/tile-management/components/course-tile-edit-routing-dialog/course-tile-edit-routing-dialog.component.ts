import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tile } from '../../domain/tile';
import { TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
import { CourseTileChangesService } from '../../services/course-tile-changes.service';
import { TilesDataService } from '../../services/tiles-data.service';
import { CourseKind } from '../course-tile-list/course-tile-list.component';
import { CourseTileEditDialogComponent } from '../course-tile-edit-dialog/course-tile-edit-dialog.component';

const buildBlankTile = (): Tile => ({
    id: `new-${Date.now()}`,
    order: 0,
    type: TileType.Course,
    title: '',
    date: new Date().toISOString(),
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    status: TileStatus.Open,
    expiration: new Date().toISOString(),
    behavior: TileBehavior.View,
    visible: true,
});

// Aux-route (outlet: 'modal') driven dialog opener - same pattern as
// member-edit-routing-dialog.component.ts. :id is either a real tile id
// (edit) or 'neu' (create). courseKind comes from the route's own `data`
// (see app.routes.ts's sportkurs-bearbeiten/skikurs-bearbeiten entries) -
// for a new Sportkurs, tile.course is seeded upfront here (replacing the
// old "Dies ist ein Pilates-/Gymnastik-Kurs" checkbox); a new Ski-/
// Snowboardkurs never gets it. tile.courseConfig is left unset - that's
// TileEditorComponent.ngOnChanges()'s own job once it receives the tile.
@Component({
    selector: 'app-course-tile-edit-routing-dialog',
    standalone: true,
    template: '',
})
export class CourseTileEditRoutingDialogComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly dataService = inject(TilesDataService);
    private readonly courseTileChanges = inject(CourseTileChangesService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        const courseKind = this.route.snapshot.data['courseKind'] as CourseKind;

        if (id && id !== 'neu') {
            this.dataService.getTile(id).subscribe({
                next: (tile) => this.open(tile, courseKind),
                error: () => this.close(),
            });
            return;
        }

        const tile = buildBlankTile();
        if (courseKind === 'sport') {
            tile.course = {
                name: '',
                description: '',
                details: '',
                time: '',
                location: '',
                contact: '',
                prices: { member: '', nonMember: '' },
            };
        }
        this.open(tile, courseKind);
    }

    private open(tile: Tile, courseKind: CourseKind): void {
        const dialogRef = this.dialog.open(CourseTileEditDialogComponent, {
            data: { tile, courseKind },
            panelClass: 'course-tile-dialog-panel',
            position: { top: '0', right: '0', bottom: '0' },
            width: '640px',
            maxWidth: '95vw',
            height: '100vh',
            hasBackdrop: true,
            enterAnimationDuration: '200ms',
            exitAnimationDuration: '150ms',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.courseTileChanges.notifyChanged();
            this.close();
        });
    }

    private close(): void {
        this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
    }
}
