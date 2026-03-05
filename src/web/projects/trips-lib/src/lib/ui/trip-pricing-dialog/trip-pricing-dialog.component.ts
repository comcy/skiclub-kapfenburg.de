/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TripConfig } from '../../domain/models/trip-config';

interface PriceRow {
    category: string;
    member: number;
    nonMember: number;
}

@Component({
    selector: 'lib-trip-pricing-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
    templateUrl: './trip-pricing-dialog.component.html',
    styleUrls: ['./trip-pricing-dialog.component.scss'],
})
export class TripPricingDialogComponent {
    public data = inject<{ tripConfig: TripConfig; title: string }>(MAT_DIALOG_DATA);

    public transportEquipmentDataSource: MatTableDataSource<PriceRow> | null = null;
    public busLiftDataSource: MatTableDataSource<PriceRow> | null = null;
    public coursesDataSource: MatTableDataSource<PriceRow> | null = null;

    public displayedColumns: string[] = ['category', 'member', 'nonMember'];

    constructor() {
        const pricing = this.data.tripConfig.pricing;

        // 1. Transport & Equipment
        const transportRows: PriceRow[] = [];
        if (pricing.busOnly) {
            transportRows.push({
                category: 'Nur Busfahrt (ohne Skipass)',
                member: pricing.busOnly.member,
                nonMember: pricing.busOnly.nonMember,
            });
        }
        if (pricing.addons?.snowshoes) {
            transportRows.push({
                category: 'Schneeschuhe (Leihgebühr)',
                member: pricing.addons.snowshoes.member,
                nonMember: pricing.addons.snowshoes.nonMember,
            });
        }
        if (transportRows.length > 0) {
            this.transportEquipmentDataSource = new MatTableDataSource(transportRows);
        }

        // 2. Bus + Lift (General Pricing by Age)
        if (pricing.busLift) {
            const busLiftRows: PriceRow[] = [
                { category: 'Erwachsene', ...pricing.busLift.adult },
                { category: 'Jugendliche (bis 16 J.)', ...pricing.busLift.youthUntil16 },
                { category: 'Kinder (bis 6 J.)', ...pricing.busLift.childUntil6 },
            ];
            this.busLiftDataSource = new MatTableDataSource(busLiftRows);
        }

        // 3. Courses & Training
        const addons = pricing.addons;
        if (addons) {
            const courseRows: PriceRow[] = [];

            if (addons.courseBeginner) {
                courseRows.push({
                    category: 'Anfängerkurs',
                    member: addons.courseBeginner.member,
                    nonMember: addons.courseBeginner.nonMember,
                });
            }
            if (addons.courseAdvanced) {
                courseRows.push({
                    category: 'Fortgeschrittenenkurs',
                    member: addons.courseAdvanced.member,
                    nonMember: addons.courseAdvanced.nonMember,
                });
            }
            if (addons.technikHalf) {
                courseRows.push({
                    category: 'Techniktraining (1/2 Tag)',
                    member: addons.technikHalf.member,
                    nonMember: addons.technikHalf.nonMember,
                });
            }
            if (addons.technikFull) {
                courseRows.push({
                    category: 'Techniktraining (ganzer Tag)',
                    member: addons.technikFull.member,
                    nonMember: addons.technikFull.nonMember,
                });
            }

            if (courseRows.length > 0) {
                this.coursesDataSource = new MatTableDataSource(courseRows);
            }
        }
    }
}
