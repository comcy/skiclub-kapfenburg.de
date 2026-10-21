import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PanelShellComponent } from '../shared/components/panel-shell/panel-shell.component';

// Platzhalter fuer die Auswertungen: spaeter Charts (Anmeldungen je Ausfahrt/Kurs, Verlauf ueber die
// Saison, Mitgliederentwicklung) und Abfragen. Noch ohne Daten und ohne eigene Endpunkte.
@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [MatIconModule, PanelShellComponent],
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent {}
