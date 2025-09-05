import { TestBed } from '@angular/core/testing';
import { GymInformationCoreService } from './gym-information-core.service';
import { GymInformationProviderServiceInterface } from '../../api/provider-services/gym-provider-service.interface';
import { of } from 'rxjs';

describe('GymInformationCoreService', () => {
    const mockOffers = [
        { title: 'A', appointment: 't1', description: 'd1', contact: 'c1' },
        { title: 'B', appointment: 't2', description: 'd2', contact: 'c2' },
    ];

    const providerMock: GymInformationProviderServiceInterface = {
        getGymOffers: () => of(mockOffers),
    };

    let service: GymInformationCoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GymInformationCoreService,
                { provide: GymInformationProviderServiceInterface, useValue: providerMock },
            ],
        });
        service = TestBed.inject(GymInformationCoreService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should replace initial offers with provider offers', (done) => {
        service.gymOffers$.subscribe((offers) => {
            if (offers.length === mockOffers.length && offers[0].title === 'A') {
                expect(offers).toEqual(mockOffers);
                done();
            }
        });
    });
});
