import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../auth/services/auth.service';
import { Member, MemberCreationParams } from '../../domain/member';
import { MembersDataService } from '../../services/members-data.service';

@Component({
    selector: 'app-member-editor',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule],
    templateUrl: './member-editor.component.html',
    styleUrls: ['./member-editor.component.scss'],
})
export class MemberEditorComponent {
    @Input() member: Member | null = null;
    @Output() saved = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    // Not the id check of "new-..." tiles use - members created from scratch
    // or from an application both start with id: '', same as boardings.
    get isFromApplication(): boolean {
        return !this.member?.id && !!this.member?.applicationRegistrationId;
    }

    onSave(): void {
        if (!this.member) return;

        const params: MemberCreationParams = {
            firstName: this.member.firstName,
            lastName: this.member.lastName,
            email: this.member.email || undefined,
            phone: this.member.phone || undefined,
            mobile: this.member.mobile || undefined,
            birthday: this.member.birthday || undefined,
            address: this.member.address || undefined,
            isFamilyMembership: this.member.isFamilyMembership,
            familyGroupId: this.member.familyGroupId || undefined,
            status: this.member.status,
            source: this.member.source,
            applicationRegistrationId: this.member.applicationRegistrationId || undefined,
            notes: this.member.notes || undefined,
            memberSince: this.member.memberSince || undefined,
            externalId: this.member.externalId || undefined,
            iban: this.member.iban || undefined,
            bic: this.member.bic || undefined,
            bankName: this.member.bankName || undefined,
            accountHolder: this.member.accountHolder || undefined,
            paymentMethod: this.member.paymentMethod || undefined,
        };

        // Zoneless change detection (see app.config.ts) - without
        // markForCheck() the parent's editor panel wouldn't visibly close.
        if (this.member.id) {
            this.dataService.updateMember(this.member.id, params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        } else {
            this.dataService.createMember(params).subscribe(() => {
                this.saved.emit();
                this.cdr.markForCheck();
            });
        }
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}
