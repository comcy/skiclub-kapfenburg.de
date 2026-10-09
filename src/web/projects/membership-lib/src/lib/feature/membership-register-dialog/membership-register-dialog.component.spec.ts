/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { MembershipRegisterDialogComponent } from './membership-register-dialog.component';
import { MembershipDialogData } from './membership-register-dialog.interfaces';
import { MembershipRegistrationFormServiceInterface } from '../../ui/membership-registration-form/membership-registration-form.interfaces';
import { Tile } from 'projects/shared-lib/src/lib/ui-common/models';

describe('MembershipRegisterDialogComponent', () => {
    let component: MembershipRegisterDialogComponent;
    let fixture: ComponentFixture<MembershipRegisterDialogComponent>;

    beforeEach(async () => {
        // Only .title is actually read (see the component's dialogTitle) -
        // a full Tile union member isn't needed for that.
        const dialogData: MembershipDialogData = { tile: { title: 'Mitglied werden' } as unknown as Tile };

        const mockFormService = jasmine.createSpyObj<MembershipRegistrationFormServiceInterface>(
            'MembershipRegistrationFormServiceInterface',
            ['submitRegistration', 'getTurnstileSiteKey', 'confirmRegistration'],
        );
        mockFormService.getTurnstileSiteKey.and.returnValue('test-site-key');
        mockFormService.confirmRegistration.and.returnValue(of(undefined));

        await TestBed.configureTestingModule({
            imports: [MembershipRegisterDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: { close: () => undefined } },
                { provide: MembershipRegistrationFormServiceInterface, useValue: mockFormService },
            ],
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
