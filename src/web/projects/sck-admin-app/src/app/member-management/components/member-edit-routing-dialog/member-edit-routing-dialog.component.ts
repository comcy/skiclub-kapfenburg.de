import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
                    this.open({
                        ...BLANK_MEMBER,
                        firstName: application.firstName,
                        lastName: application.lastName,
                        email: application.email,
                        phone: application.phone,
                        birthday: application.birthday,
                        address: application.address,
                        isFamilyMembership: !!application.isFamilyMembership,
                        source: 'online',
                        applicationRegistrationId: application.registrationId,
                    });
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
