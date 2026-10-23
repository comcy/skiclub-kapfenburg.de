/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AgeCategory } from '../../domain/models/trip-base';
import { TripConfig } from '../../domain/models/trip-config';
import { getUniformPrice, getVisibleAgeCategories } from '../../domain/models/trip-price-table';

interface PriceRow {
    category: string;
    member: number;
    nonMember: number;
}

const AGE_CATEGORY_LABEL: Record<AgeCategory, string> = {
    adult: 'Erwachsene',
    youthUntil16: 'Jugendliche (bis 16 J.)',
    childUntil6: 'Kinder (bis 6 J.)',
};

@Component({
    selector: 'lib-trip-pricing-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
    templateUrl: './trip-pricing-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./trip-pricing-dialog.component.scss'],
})
export class TripPricingDialogComponent {
    public data = inject<{ tripConfig: TripConfig; title: string }>(MAT_DIALOG_DATA);

    public transportEquipmentDataSource: MatTableDataSource<PriceRow> | null = null;
    public busLiftDataSource: MatTableDataSource<PriceRow> | null = null;
    public coursesDataSource: MatTableDataSource<PriceRow> | null = null;

    public displayedColumns: string[] = ['category', 'member', 'nonMember'];

    constructor() {
        const pricing = this.data.tripConfig.pricing ?? {};

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

        // 2. Bus + Lift (General Pricing by Age) - echte Einheitspreise
        // (siehe #198) werden als eine einzelne Zeile statt als
        // Altersgruppen-Zeilen gezeigt, bleiben aber in derselben Tabelle.
        if (pricing.busLift) {
            const visibleCategories = getVisibleAgeCategories(this.data.tripConfig);
            const busLiftRows: PriceRow[] = visibleCategories.map((category) => ({
                category: AGE_CATEGORY_LABEL[category],
                ...pricing.busLift![category],
            }));
            const uniformPrice = getUniformPrice(busLiftRows);
            this.busLiftDataSource = new MatTableDataSource(
                uniformPrice !== undefined
                    ? [{ category: 'Bus + Liftkarte (pro Person)', member: uniformPrice, nonMember: uniformPrice }]
                    : busLiftRows,
            );
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
