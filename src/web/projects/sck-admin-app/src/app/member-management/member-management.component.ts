import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { MemberImportComponent } from './components/member-import/member-import.component';
import { MemberListComponent } from './components/member-list/member-list.component';

@Component({
    selector: 'app-member-management',
    standalone: true,
    imports: [MemberListComponent, MemberImportComponent],
    templateUrl: './member-management.component.html',
    styleUrls: ['./member-management.component.scss'],
})
export class MemberManagementComponent {
    public readonly auth = inject(AuthService);

    // Replaces the list view entirely while open - toggling this back off
    // remounts app-member-list, which already re-fetches in its own
    // ngOnInit(), so no explicit refresh() call is needed here.
    importOpen = false;
}
