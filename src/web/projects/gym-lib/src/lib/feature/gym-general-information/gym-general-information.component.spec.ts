/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GymInformation, GymInformationCoreServiceInterface } from '../../domain';
import { GymGeneralInformationComponent } from './gym-general-information.component';

describe('GymGeneralInformationComponent', () => {
    let component: GymGeneralInformationComponent;
    let fixture: ComponentFixture<GymGeneralInformationComponent>;
    let gymState: GymInformationCoreServiceInterface;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [GymGeneralInformationComponent],
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GymGeneralInformationComponent);
        component = fixture.componentInstance;
        gymState = {
            gymOffers$: new BehaviorSubject<GymInformation[]>([]),
        };
        component.gymState = gymState;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a gymState input', () => {
        expect(component.gymState).toBeDefined();
    });

    it('should display gym offers', () => {
        const gymOffers = <GymInformation[]>[
            {
                title: 'Title 1',
                appointment: 'Appointment 1',
                description: 'Description 1',
                contact: 'Contact 1',
            },
            {
                title: 'Title 2',
                appointment: 'Appointment 2',
                description: 'Description 2',
                contact: 'Contact 2',
            },
        ];
        gymState.gymOffers$.next(gymOffers);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelectorAll('.info-page').length).toBe(gymOffers.length);
        gymOffers.forEach((offer, index) => {
            expect(compiled.querySelectorAll('.info-page')[index].textContent).toContain(offer.title);
            expect(compiled.querySelectorAll('.info-page')[index].textContent).toContain(offer.description);
        });
    });
});
