import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipDetailDialogComponent } from './membership-detail-dialog.component';

describe('MembershipDetailDialogComponent', () => {
    let component: MembershipDetailDialogComponent;
    let fixture: ComponentFixture<MembershipDetailDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MembershipDetailDialogComponent],
        });
        fixture = TestBed.createComponent(MembershipDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
