/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MembershipRegistrationFormServiceInterface } from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';

type ConfirmState = 'loading' | 'success' | 'error';

// Landing page for the double-opt-in link in the membership registration
// mail (see membership-mail-service.ts's getMembershipOptInMailText). Mirrors
// the state-machine shape of sck-admin-app's AuthCallbackComponent, but stays
// on this page and shows the result instead of redirecting - there's no
// dashboard to land on for an anonymous applicant.
@Component({
    selector: 'app-membership-confirm',
    templateUrl: './membership-confirm.component.html',
    styleUrls: ['./membership-confirm.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterModule],
})
export class MembershipConfirmComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly membershipRegistrationFormService = inject(MembershipRegistrationFormServiceInterface);
    private readonly cdr = inject(ChangeDetectorRef);

    public state: ConfirmState = 'loading';

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (!token) {
            this.state = 'error';
            return;
        }

        this.membershipRegistrationFormService.confirmRegistration(token).subscribe({
            next: () => {
                this.state = 'success';
                this.cdr.markForCheck();
            },
            error: () => {
                this.state = 'error';
                this.cdr.markForCheck();
            },
        });
    }
}
