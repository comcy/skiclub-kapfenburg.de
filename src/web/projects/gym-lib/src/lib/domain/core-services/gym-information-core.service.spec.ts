import { TestBed } from '@angular/core/testing';
import { GymInformationCoreService } from './gym-information-core.service';
import { GymInformationProviderServiceInterface } from '../../api/provider-services/gym-provider-service.interface';
import { GymCourseInformation } from '../models/gym-course-information';
import { of } from 'rxjs';

describe('GymInformationCoreService', () => {
    const mockOffers: GymCourseInformation[] = [
        { name: 'A', description: 'd1', details: 'details1', time: 't1', location: 'l1', contact: 'c1' },
        { name: 'B', description: 'd2', details: 'details2', time: 't2', location: 'l2', contact: 'c2' },
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
            if (offers.length === mockOffers.length && offers[0].name === 'A') {
                expect(offers).toEqual(mockOffers);
                done();
            }
        });
    });
});
