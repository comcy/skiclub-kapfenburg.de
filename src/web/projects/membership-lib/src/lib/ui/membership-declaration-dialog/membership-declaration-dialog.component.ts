/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'lib-membership-declaration-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>Beitrittserklärung</h2>
        <mat-dialog-content class="mat-typography">
            <h3>1. Mitgliedschaft</h3>
            <p>
                Mit dem Absenden des Online-Formulars beantrage ich die Mitgliedschaft im Skiclub Kapfenburg e.V. Die
                Mitgliedschaft wird erst mit der Bestätigung durch den Vorstand wirksam.
            </p>

            <h3>2. Satzung</h3>
            <p>
                Ich erkenne die Satzung des Skiclub Kapfenburg e.V. in ihrer jeweils gültigen Fassung sowie die
                Beschlüsse der Mitgliederversammlung an.
            </p>

            <h3>3. Mitgliedsbeitrag</h3>
            <p>
                Der Jahresbeitrag richtet sich nach der aktuell gültigen Beitragsordnung und wird jährlich per
                SEPA-Lastschrift eingezogen.
            </p>

            <h3>4. Kündigung</h3>
            <p>
                Die Mitgliedschaft kann jederzeit schriftlich zum Ende des Kalenderjahres gegenüber dem Vorstand
                gekündigt werden.
            </p>

            <h3>5. Datennutzung</h3>
            <p>
                Die im Rahmen des Beitritts erhobenen Daten werden ausschließlich zur Verwaltung der Mitgliedschaft und
                zur Abwicklung des Beitragseinzugs verwendet. Weitere Informationen findest du in unserer
                Datenschutzerklärung.
            </p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close color="primary">Schließen</button>
        </mat-dialog-actions>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [
        `
            mat-dialog-content {
                max-height: 60vh;
            }
            h3 {
                margin-top: 20px;
            }
        `,
    ],
})
export class MembershipDeclarationDialogComponent {}
