/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { TripsFeatureModule } from '@trips-lib';
import { TileActions, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { Trip } from 'projects/trips-lib/src/lib/domain/models';
import { TilesApiService } from '../../../../services/tiles/tiles-api.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    imports: [TripsFeatureModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
})
export class RegistrationComponent implements OnInit {
    private readonly tilesApi = inject(TilesApiService);

    public trips: Trip[] = [];

    ngOnInit(): void {
        this.tilesApi.getTiles().subscribe((tiles) => {
            const events = tiles.filter((t) => t.type === TileType.Event);

            for (const t of events) {
                if (t.actions?.includes(TileActions.Register)) {
                    this.trips.push({
                        destination: t.destination || t.title,
                        date: t.date,
                        availableBoardings: t.boardings as string[],
                        tripConfig: t.tripConfig,
                    });
                }
            }
        });
    }
}
