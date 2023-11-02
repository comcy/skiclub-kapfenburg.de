/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TRIP_DOWNLOADS } from 'projects/data/downloads';
import { DownloadItem, TripsFeatureModule } from 'projects/trips-lib/src/public-api';

@Component({
    standalone: true,
    selector: 'app-downloads',
    templateUrl: './downloads.component.html',
    imports: [CommonModule, TripsFeatureModule],
})
export class DownloadsComponent {
    tripDownloads: DownloadItem[] = TRIP_DOWNLOADS;
}
