import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MembershipApplication } from '../../domain/membership-application';
import { MembersDataService } from '../../services/members-data.service';
import { ApplicationListComponent } from './application-list.component';

const buildApplication = (overrides: Partial<MembershipApplication> = {}): MembershipApplication => ({
    registrationId: 'reg-1',
    timestamp: '2026-01-01T00:00:00.000Z',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    confirmed: false,
    ...overrides,
});

describe('ApplicationListComponent', () => {
    let fixture: ComponentFixture<ApplicationListComponent>;
    let dataServiceSpy: jasmine.SpyObj<MembersDataService>;

    const setup = (applications: MembershipApplication[]) => {
        dataServiceSpy = jasmine.createSpyObj<MembersDataService>('MembersDataService', ['getMembershipApplications']);
        dataServiceSpy.getMembershipApplications.and.returnValue(of(applications));

        TestBed.configureTestingModule({
            imports: [ApplicationListComponent],
            providers: [{ provide: MembersDataService, useValue: dataServiceSpy }],
        });
        fixture = TestBed.createComponent(ApplicationListComponent);
        fixture.detectChanges();
    };

    it('disables "Als Mitglied übernehmen" for an unconfirmed application', () => {
        setup([buildApplication({ confirmed: false })]);

        const button = fixture.debugElement.query(By.css('button[color="primary"]'));
        expect(button.nativeElement.disabled).toBe(true);
    });

    it('enables "Als Mitglied übernehmen" for a confirmed application', () => {
        setup([buildApplication({ confirmed: true })]);

        const button = fixture.debugElement.query(By.css('button[color="primary"]'));
        expect(button.nativeElement.disabled).toBe(false);
    });

    it('emits promote only when the button is clicked for a confirmed application', () => {
        setup([buildApplication({ confirmed: true })]);
        const promoteSpy = jasmine.createSpy('promote');
        fixture.componentInstance.promote.subscribe(promoteSpy);

        fixture.debugElement.query(By.css('button[color="primary"]')).nativeElement.click();

        expect(promoteSpy).toHaveBeenCalledWith(jasmine.objectContaining({ confirmed: true }));
    });
});
