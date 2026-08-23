/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSE_DATA, STATIC_DATA } from '@data';
import { TripsRegisterDialogComponent } from '@trips-lib';
import { CourseTilesApiServiceInterface } from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { GymCoursesRegisterDialogComponent } from 'projects/gym-lib/src/lib/feature/gym-courses-register-dialog/gym-courses-register-dialog.component';
import { MembershipRegisterDialogComponent } from 'projects/membership-lib/src/lib/feature/membership-register-dialog/membership-register-dialog.component';
import { MembershipDeclarationDialogComponent } from 'projects/membership-lib/src/lib/ui/membership-declaration-dialog/membership-declaration-dialog.component';
import { CourseTile, Tile, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { TripTilesApiServiceInterface } from 'projects/trips-lib/src/lib/api/trip-tiles-api.interface';
import { AgbDialogComponent } from 'projects/trips-lib/src/lib/ui/agb-dialog/agb-dialog.component';
import { combineLatest, Subject, takeUntil } from 'rxjs';

const MEMBERSHIP_TILE_ID = 'membership';

@Component({
    selector: 'app-routing-dialog',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export class RoutingDialogComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private tripsApi = inject(TripTilesApiServiceInterface);
    private courseTilesApi = inject(CourseTilesApiServiceInterface);
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const id = params['id'];
            const type = this.route.snapshot.data['dialogType'];

            if (type === 'agb') {
                this.openAgbDialog();
            } else if (type === 'satzung') {
                this.openDeclarationDialog();
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
        combineLatest([this.tripsApi.getAllTrips(), this.courseTilesApi.getAllCourseBccTiles()])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([trips, bccTiles]) => {
                const allTiles: Tile[] = [...COURSE_DATA, ...STATIC_DATA, ...trips];
                let tile = allTiles.find((t) => t.id === id);

                if (!tile) {
                    this.close();
                    return;
                }

                if (tile.type === TileType.Course) {
                    const courseTile = tile as CourseTile;
                    const customBccList = bccTiles.find((t) => t.title === courseTile.course.name)?.courseConfig
                        ?.customBccList;
                    tile = { ...courseTile, course: { ...courseTile.course, customBccList } };
                }

                const dialogRef = this.dialog.open(this.resolveRegisterDialogComponent(tile), {
                    data: { tile },
                    width: '90vw',
                    maxWidth: '600px',
                });

                dialogRef.afterClosed().subscribe(() => this.close());
            });
    }

    private resolveRegisterDialogComponent(tile: Tile): ComponentType<unknown> {
        if (tile.id === MEMBERSHIP_TILE_ID) {
            return MembershipRegisterDialogComponent;
        }
        return tile.type === TileType.Course ? GymCoursesRegisterDialogComponent : TripsRegisterDialogComponent;
    }

    private openAgbDialog(): void {
        const dialogRef = this.dialog.open(AgbDialogComponent, {
            width: '90vw',
            maxWidth: '800px',
        });

        dialogRef.afterClosed().subscribe(() => this.close());
    }

    private openDeclarationDialog(): void {
        const dialogRef = this.dialog.open(MembershipDeclarationDialogComponent, {
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
