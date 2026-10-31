import { Component, Input } from '@angular/core';

// Füllstandsbalken der Ausfahrten (Karten-Management + Anmeldungen): < 70 % grün, ab 70 % gelb,
// ab 90 % (inkl. voll/überbucht) rot. Ohne Kapazität wird nichts angezeigt.
@Component({
    selector: 'app-occupancy-bar',
    standalone: true,
    template: `
        @if (capacity) {
            <div
                class="bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                [attr.aria-valuenow]="percent"
                [attr.aria-label]="'Belegung ' + percent + ' Prozent'"
            >
                <div class="fill" [class]="level" [style.width.%]="percent"></div>
            </div>
        }
    `,
    styles: `
        .bar {
            height: 6px;
            min-width: 90px;
            margin-top: 4px;
            border-radius: 3px;
            background: var(--mat-sys-surface-variant);
            overflow: hidden;
        }
        .fill {
            height: 100%;
            border-radius: 3px;
        }
        .ok {
            background: light-dark(#2e7d32, #81c784);
        }
        .warn {
            background: light-dark(#f9a825, #ffd54f);
        }
        .full {
            background: light-dark(#c62828, #ffb4a8);
        }
    `,
})
export class OccupancyBarComponent {
    @Input() count = 0;
    @Input() capacity: number | undefined | null;

    get percent(): number {
        return this.capacity ? Math.min(100, Math.round((this.count / this.capacity) * 100)) : 0;
    }

    get level(): 'ok' | 'warn' | 'full' {
        const ratio = this.capacity ? this.count / this.capacity : 0;
        return ratio >= 0.9 ? 'full' : ratio >= 0.7 ? 'warn' : 'ok';
    }
}
