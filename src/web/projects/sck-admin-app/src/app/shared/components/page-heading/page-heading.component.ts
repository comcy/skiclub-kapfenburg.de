import { Component, Input } from '@angular/core';

// Einheitliche Seitenueberschrift direkt unter den Tabs: Titel links, Aktionen (Buttons) rechts
// per Content-Projection. Auf jeder Tab-Seite verwenden statt einer eigenen .header-Zeile.
@Component({
    selector: 'app-page-heading',
    standalone: true,
    template: `
        <div class="page-heading">
            <h2>{{ title }}</h2>
            <div class="actions"><ng-content></ng-content></div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                flex-shrink: 0;
            }

            .page-heading {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 8px 16px;
                margin-bottom: 8px;
                // So hoch wie ein Button: mit und ohne Aktion sitzt der Titel gleich.
                min-height: 40px;
            }

            h2 {
                margin: 0;
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
        `,
    ],
})
export class PageHeadingComponent {
    @Input({ required: true }) title!: string;
}
