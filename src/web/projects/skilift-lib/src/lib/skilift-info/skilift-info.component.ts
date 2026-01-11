import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoipenSnowStatus, SkiliftOpeningHours, SkiliftPrices, SkiliftSnowStatus } from './skilift-info.interfaces';
import {
    LOIPEN_STATUS,
    SKILIFT_CONDITIONS,
    SKILIFT_OPENING_HOURS,
    SKILIFT_PRICES,
    SKILIFT_STATUS,
} from 'projects/data/skilift-data';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'lib-skilift-info',
    standalone: true,
    imports: [CommonModule, MatIcon],
    templateUrl: './skilift-info.component.html',
    styleUrls: ['./skilift-info.component.scss'],
})
export class SkiliftInfoComponent {
    public openingHours: SkiliftOpeningHours[] = SKILIFT_OPENING_HOURS;
    public conditions: string[] = SKILIFT_CONDITIONS;
    public prices: SkiliftPrices[] = SKILIFT_PRICES;
    public snowStatus: SkiliftSnowStatus = SKILIFT_STATUS;
    public loipenStatus: LoipenSnowStatus = LOIPEN_STATUS;
}
