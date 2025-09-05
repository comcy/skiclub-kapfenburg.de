import { TestBed } from '@angular/core/testing';
import { GymInformationProviderService } from './gym-information-provider.service';

describe('GymInformationProviderService', () => {
    it('should create and return offers', (done) => {
        TestBed.configureTestingModule({ providers: [GymInformationProviderService] });
        const service = TestBed.inject(GymInformationProviderService);
        expect(service).toBeTruthy();
        service.getGymOffers().subscribe((offers) => {
            expect(Array.isArray(offers)).toBeTrue();
            expect(offers.length).toBeGreaterThan(0);
            done();
        });
    });
});
