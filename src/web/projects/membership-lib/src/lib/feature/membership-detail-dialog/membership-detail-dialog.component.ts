import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lib-membership-detail-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './membership-detail-dialog.component.html',
    styleUrls: ['./membership-detail-dialog.component.scss'],
})
export class MembershipDetailDialogComponent {
    public dialogTitle = 'Test';
    public share = true;
}
