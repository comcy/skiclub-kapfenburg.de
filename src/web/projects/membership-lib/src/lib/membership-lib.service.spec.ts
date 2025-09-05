import { TestBed } from '@angular/core/testing';
import { MembershipLibService } from './membership-lib.service';

describe('MembershipLibService', () => {
    it('should create', () => {
        TestBed.configureTestingModule({});
        const service = TestBed.inject(MembershipLibService);
        expect(service).toBeTruthy();
    });
});
