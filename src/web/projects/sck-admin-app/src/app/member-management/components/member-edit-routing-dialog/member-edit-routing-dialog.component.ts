import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Member } from '../../domain/member';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';
import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';

const BLANK_MEMBER: Member = {
    id: '',
    firstName: '',
    lastName: '',
    isFamilyMembership: false,
    status: 'active',
    source: 'manual',
};

const toLocalIsoDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
};

// Aux-route (outlet: 'modal') driven dialog opener - same pattern as
// sck-app's RoutingDialogComponent: an empty-template component that reads
// the route, opens a real MatDialog, and clears the outlet again on close.
// :id is either a real member id (edit), or 'neu' (create - optionally with
// a ?antragId= query param to prefill from a pending Mitgliedsantrag, same
// data member-management.component.ts's old onPromote() used to build).
@Component({
    selector: 'app-member-edit-routing-dialog',
    standalone: true,
    template: '',
})
export class MemberEditRoutingDialogComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly dataService = inject(MembersDataService);
    private readonly memberChanges = inject(MemberChangesService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        const antragId = this.route.snapshot.queryParamMap.get('antragId');

        if (id && id !== 'neu') {
            this.dataService.getMember(id).subscribe({
                next: (member) => this.open(member),
                error: () => this.close(),
            });
            return;
        }

        if (antragId) {
            this.dataService.getMembershipApplications().subscribe({
                next: (applications) => {
                    const application = applications.find((a) => a.registrationId === antragId);
                    if (!application || !application.confirmed) {
                        this.close();
                        return;
                    }
                    // IBAN des Antrags ins Mitgliedsformular uebernehmen - schlaegt der Abruf fehl
                    // (keine IBAN gespeichert, Schluessel passt nicht), oeffnet das Formular ohne.
                    this.dataService
                        .getApplicationIban(application.registrationId)
                        .pipe(
                            map(({ iban }) => iban),
                            catchError(() => of(undefined)),
                        )
                        .subscribe((iban) =>
                            this.open({
                                ...BLANK_MEMBER,
                                firstName: application.firstName,
                                lastName: application.lastName,
                                email: application.email,
                                phone: application.phone,
                                birthday: application.birthday,
                                address: application.address,
                                iban,
                                // Der Antrag erfasst nur die IBAN - Bank und BIC werden nicht abgefragt (fuer SEPA nicht noetig).
                                // Kontoinhaber = Antragsteller, Mandat wie im Antrag erteilt.
                                accountHolder: `${application.firstName} ${application.lastName}`.trim(),
                                paymentMethod: application.sepaMandateAccepted
                                    ? `SEPA-Lastschrift (Mandat online erteilt am ${new Date(application.timestamp).toLocaleDateString('de-DE')})`
                                    : undefined,
                                isFamilyMembership: !!application.isFamilyMembership,
                                // "Mitglied seit" = Eingangsdatum des Antrags (lokales Datum, nicht UTC).
                                memberSince: toLocalIsoDate(new Date(application.timestamp)),
                                source: 'online',
                                applicationRegistrationId: application.registrationId,
                            }),
                        );
                },
                error: () => this.close(),
            });
            return;
        }

        this.open(BLANK_MEMBER);
    }

    private open(member: Member): void {
        const dialogRef = this.dialog.open(MemberEditDialogComponent, {
            data: { member },
            width: '640px',
            maxWidth: '95vw',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.memberChanges.notifyChanged();
            this.close();
        });
    }

    private close(): void {
        this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
    }
}
