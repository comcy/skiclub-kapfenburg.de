/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from 'projects/sck-app/src/environments/environment';

interface CancelPerson {
    id: string;
    name: string;
    status: 'confirmed' | 'waitlist' | 'cancelled';
    selected?: boolean;
}

interface CancelInfo {
    title: string;
    date: string;
    deadline: string | null;
    canCancel: boolean;
    people: CancelPerson[];
}

// Landing page für den Storno-Link in der Anmeldebestätigung (Issue #235, sck-api: GET/POST /trip-cancel/:token).
@Component({
    selector: 'app-trip-cancel',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterModule,
    ],
    template: `
        <mat-toolbar>Anmeldung stornieren</mat-toolbar>
        <div class="cancel-container">
            <mat-card class="cancel-card">
                @switch (state) {
                    @case ('loading') {
                        <mat-card-content class="centered"><mat-spinner diameter="40"></mat-spinner></mat-card-content>
                    }
                    @case ('error') {
                        <mat-card-header><mat-card-title>Link ungültig</mat-card-title></mat-card-header>
                        <mat-card-content>
                            <p>
                                Dieser Link ist ungültig. Bitte melde dich bei registration&#64;skiclub-kapfenburg.de.
                            </p>
                            <a mat-stroked-button routerLink="/">Zur Startseite</a>
                        </mat-card-content>
                    }
                    @case ('done') {
                        <mat-card-header><mat-card-title>Storniert</mat-card-title></mat-card-header>
                        <mat-card-content>
                            <p>
                                <mat-icon color="primary">check_circle</mat-icon>
                                Die Stornierung wurde durchgeführt. Du erhältst eine Bestätigung per E-Mail.
                            </p>
                            <a mat-raised-button color="primary" routerLink="/">Zur Startseite</a>
                        </mat-card-content>
                    }
                    @default {
                        <mat-card-header>
                            <mat-card-title>{{ info!.title }}</mat-card-title>
                            <mat-card-subtitle>{{ info!.date }}</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                            @if (!info!.canCancel) {
                                <p>
                                    Die Frist für eine Stornierung ist abgelaufen. Bitte melde dich beim Verein:
                                    registration&#64;skiclub-kapfenburg.de.
                                </p>
                            } @else if (open().length === 0) {
                                <p>Alle Anmeldungen sind bereits storniert.</p>
                            } @else {
                                <p>Wähle die Personen, die du stornieren möchtest:</p>
                                @for (p of info!.people; track p.id) {
                                    <div>
                                        <mat-checkbox [(ngModel)]="p.selected" [disabled]="p.status === 'cancelled'"
                                            >{{ p.name
                                            }}{{ p.status === 'cancelled' ? ' (storniert)' : '' }}</mat-checkbox
                                        >
                                    </div>
                                }
                                @if (error) {
                                    <p class="error">{{ error }}</p>
                                }
                                <button
                                    mat-raised-button
                                    color="warn"
                                    [disabled]="selected().length === 0 || busy"
                                    (click)="cancel()"
                                >
                                    {{ selected().length }} Anmeldung(en) stornieren
                                </button>
                            }
                        </mat-card-content>
                    }
                }
            </mat-card>
        </div>
    `,
    styles: [
        `
            .cancel-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 60vh;
                padding: 16px;
            }
            .cancel-card {
                width: 100%;
                max-width: 480px;
            }
            .centered {
                display: flex;
                justify-content: center;
                padding: 24px 0;
            }
            .error {
                color: var(--mat-sys-error, #b3261e);
            }
        `,
    ],
})
export class TripCancelComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly http = inject(HttpClient);
    private readonly cdr = inject(ChangeDetectorRef);

    public state: 'loading' | 'ready' | 'done' | 'error' = 'loading';
    public info?: CancelInfo;
    public error = '';
    public busy = false;
    private token = '';

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.token) {
            this.state = 'error';
            return;
        }
        this.http.get<CancelInfo>(`${environment.sckApiUrl}/trip-cancel/${this.token}`).subscribe({
            next: (info) => {
                // Standard: alle noch aktiven Personen vorausgewählt.
                info.people.forEach((p) => (p.selected = p.status !== 'cancelled'));
                this.info = info;
                this.state = 'ready';
                this.cdr.markForCheck();
            },
            error: () => {
                this.state = 'error';
                this.cdr.markForCheck();
            },
        });
    }

    open = (): CancelPerson[] => this.info?.people.filter((p) => p.status !== 'cancelled') ?? [];
    selected = (): CancelPerson[] => this.open().filter((p) => p.selected);

    cancel(): void {
        this.busy = true;
        this.error = '';
        this.http
            .post(`${environment.sckApiUrl}/trip-cancel/${this.token}`, { ids: this.selected().map((p) => p.id) })
            .subscribe({
                next: () => {
                    this.state = 'done';
                    this.cdr.markForCheck();
                },
                error: (e) => {
                    this.busy = false;
                    this.error = e?.error?.error ?? 'Stornierung fehlgeschlagen.';
                    this.cdr.markForCheck();
                },
            });
    }
}
