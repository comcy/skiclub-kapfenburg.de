/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipRegisterDialogComponent } from './membership-register-dialog.component';

describe('MembershipRegisterDialogComponent', () => {
    let component: MembershipRegisterDialogComponent;
    let fixture: ComponentFixture<MembershipRegisterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembershipRegisterDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipRegisterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
