import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MembershipApplication } from '../../domain/membership-application';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';

// Now its own routed tab (Anträge) rather than a section nested under the
// Mitglieder tab - "Als Mitglied übernehmen" navigates straight to the
// modal member editor (aux route) with the application's data prefilled,
// same as member-list's edit/create buttons.
@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);
    private readonly memberChanges = inject(MemberChangesService);
    private readonly snackBar = inject(MatSnackBar);

    public applications$!: Observable<MembershipApplication[]>;
    public displayedColumns: string[] = ['name', 'email', 'submittedAt', 'confirmed', 'iban', 'actions'];

    // Nur auf Klick abgerufen und nur im Speicher gehalten, nie in der Liste mitgeliefert.
    public ibans: Record<string, string> = {};
    public loadingIban = new Set<string>();

    // takeUntilDestroyed() needs an injection context - throws NG0203 inside ngOnInit().
    private readonly changesSubscription = this.memberChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.refresh());

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.applications$ = this.dataService.getMembershipApplications();
        this.cdr.markForCheck();
    }

    onShowIban(application: MembershipApplication): void {
        const id = application.registrationId;
        this.loadingIban.add(id);
        this.dataService.getApplicationIban(id).subscribe({
            next: ({ iban }) => {
                this.ibans[id] = iban;
                this.loadingIban.delete(id);
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.loadingIban.delete(id);
                this.snackBar.open(error?.error?.error ?? 'IBAN konnte nicht geladen werden.', 'OK', {
                    duration: 6000,
                });
                this.cdr.markForCheck();
            },
        });
    }

    onHideIban(application: MembershipApplication): void {
        delete this.ibans[application.registrationId];
        this.cdr.markForCheck();
    }

    onCopyIban(application: MembershipApplication): void {
        const iban = this.ibans[application.registrationId];
        if (!iban) return;
        navigator.clipboard.writeText(iban).then(() => this.snackBar.open('IBAN kopiert', 'OK', { duration: 2000 }));
    }

    sepaMandateText(application: MembershipApplication): string {
        return application.sepaMandateAccepted
            ? `SEPA-Mandat erteilt am ${new Date(application.timestamp).toLocaleDateString('de-DE')}`
            : 'Kein SEPA-Mandat';
    }

    // "DE89 3704 0044 0532 0130 00" - in Vierergruppen besser lesbar und abtippbar.
    formatIban(iban: string): string {
        return iban
            .replace(/\s+/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim();
    }

    onPromote(application: MembershipApplication): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', 'neu'] } }], {
            queryParams: { antragId: application.registrationId },
        });
    }
}
