/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSE_DATA, STATIC_DATA, TRIP_DATA } from '@data';
import { TripsRegisterDialogComponent } from '@trips-lib';
import { GymCoursesRegisterDialogComponent } from 'projects/gym-lib/src/lib/feature/gym-courses-register-dialog/gym-courses-register-dialog.component';
import { Tile, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { AgbDialogComponent } from 'projects/trips-lib/src/lib/ui/agb-dialog/agb-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-routing-dialog',
    standalone: true,
    template: '',
})
export class RoutingDialogComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const id = params['id'];
            const type = this.route.snapshot.data['dialogType'];

            if (type === 'agb') {
                this.openAgbDialog();
            } else if (id) {
                this.openRegisterDialog(id);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private openRegisterDialog(id: string): void {
        const allTiles: Tile[] = [...COURSE_DATA, ...STATIC_DATA, ...TRIP_DATA];
        const tile = allTiles.find((t) => t.id === id);

        if (!tile) {
            this.close();
            return;
        }

        const component: ComponentType<unknown> =
            tile.type === TileType.Course ? GymCoursesRegisterDialogComponent : TripsRegisterDialogComponent;

        const dialogRef = this.dialog.open(component, {
            data: { tile },
            width: '90vw',
            maxWidth: '600px',
        });

        dialogRef.afterClosed().subscribe(() => this.close());
    }

    private openAgbDialog(): void {
        const dialogRef = this.dialog.open(AgbDialogComponent, {
            width: '90vw',
            maxWidth: '800px',
        });

        dialogRef.afterClosed().subscribe(() => this.close());
    }

    private close(): void {
        this.router.navigate([{ outlets: { modal: null } }], {
            relativeTo: this.route.parent,
        });
    }
}
