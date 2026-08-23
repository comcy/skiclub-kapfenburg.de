import { Component, inject } from '@angular/core';
import { SiteHeaderComponent } from '@shared/ui-common';
import { AuthService } from '../auth/services/auth.service';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { MemberEditorComponent } from './components/member-editor/member-editor.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { Member } from './domain/member';
import { MembershipApplication } from './domain/membership-application';

@Component({
    selector: 'app-member-management',
    standalone: true,
    imports: [SiteHeaderComponent, MemberListComponent, MemberEditorComponent, ApplicationListComponent],
    templateUrl: './member-management.component.html',
    styleUrls: ['./member-management.component.scss'],
})
export class MemberManagementComponent {
    public readonly auth = inject(AuthService);

    selectedMember: Member | null = null;

    onMemberSelected(member: Member): void {
        // Clone to avoid mutating the list's row directly before save.
        this.selectedMember = { ...member };
    }

    onPromote(application: MembershipApplication): void {
        this.selectedMember = {
            id: '',
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            phone: application.phone,
            birthday: application.birthday,
            address: application.address,
            isFamilyMembership: !!application.isFamilyMembership,
            status: 'active',
            source: 'online',
            applicationRegistrationId: application.registrationId,
        };
    }

    onMemberSaved(memberList: MemberListComponent, applicationList: ApplicationListComponent): void {
        this.selectedMember = null;
        memberList.refresh();
        applicationList.refresh();
    }
}
