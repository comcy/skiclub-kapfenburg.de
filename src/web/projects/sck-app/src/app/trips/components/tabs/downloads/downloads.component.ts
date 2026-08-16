/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TRIP_DOWNLOADS } from 'projects/data/downloads';
import { DownloadItem, TripsFeatureModule } from 'projects/trips-lib/src/public-api';

@Component({
    selector: 'app-downloads',
    templateUrl: './downloads.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TripsFeatureModule],
})
export class DownloadsComponent {
    tripDownloads: DownloadItem[] = TRIP_DOWNLOADS;
}
