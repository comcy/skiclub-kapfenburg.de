/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { DownloadItem } from '../../domain';
import { NgFor } from '@angular/common';

@Component({
    selector: 'lib-trips-downloads',
    templateUrl: './trips-downloads.component.html',
    styleUrls: ['./trips-downloads.component.scss'],
    imports: [NgFor],
})
export class TripsDownloadsComponent {
    @Input() downloads: DownloadItem[] = [{ name: 'asdasd', link: 'https://www.google.de' }];
}
