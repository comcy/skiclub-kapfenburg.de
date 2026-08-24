import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { TripRegistration } from '../../domain/trip-registration';
import { TilesDataService } from '../../services/tiles-data.service';
import { TripRegistrationsComponent } from './trip-registrations.component';

const makeRegistration = (overrides: Partial<TripRegistration> = {}): TripRegistration => ({
    id: `reg-${Math.random()}`,
    tileId: 'tile-1',
    firstName: 'Max',
    lastName: 'Mustermann',
    ageCategory: 'adult',
    isMember: false,
    status: 'confirmed',
    source: 'manual',
    orderIndex: 0,
    ...overrides,
});

describe('TripRegistrationsComponent', () => {
    let component: TripRegistrationsComponent;
    let fixture: ComponentFixture<TripRegistrationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripRegistrationsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: convertToParamMap({ tileId: 'tile-1' }) } },
                },
                { provide: Router, useValue: { navigate: () => {} } },
                {
                    provide: TilesDataService,
                    useValue: {
                        getTile: () => of(null),
                        getRegistrations: () => of([]),
                        deleteRegistration: () => of(undefined),
                    },
                },
                { provide: AuthService, useValue: { hasPermission: () => true } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TripRegistrationsComponent);
        component = fixture.componentInstance;
    });

    describe('Kapazitäts-Warnung (Runde 1)', () => {
        it('isOverCapacity is false when the tile has no capacity set', () => {
            component.tile = { capacity: undefined } as never;
            component.registrations = [makeRegistration(), makeRegistration()];

            expect(component.isOverCapacity).toBeFalse();
        });

        it('isOverCapacity is false when confirmed registrations are below capacity', () => {
            component.tile = { capacity: 3 } as never;
            component.registrations = [makeRegistration(), makeRegistration()];

            expect(component.isOverCapacity).toBeFalse();
        });

        it('isOverCapacity is true once confirmed registrations reach capacity', () => {
            component.tile = { capacity: 2 } as never;
            component.registrations = [makeRegistration(), makeRegistration()];

            expect(component.isOverCapacity).toBeTrue();
        });

        it('waitlist registrations do not count toward confirmedCount / isOverCapacity', () => {
            component.tile = { capacity: 2 } as never;
            component.registrations = [
                makeRegistration({ status: 'confirmed' }),
                makeRegistration({ status: 'waitlist' }),
                makeRegistration({ status: 'waitlist' }),
            ];

            expect(component.confirmedCount).toBe(1);
            expect(component.waitlistCount).toBe(2);
            expect(component.isOverCapacity).toBeFalse();
        });

        it('capacityPercent is clamped at 100 when over capacity', () => {
            component.tile = { capacity: 2 } as never;
            component.registrations = [makeRegistration(), makeRegistration(), makeRegistration()];

            expect(component.capacityPercent).toBe(100);
        });
    });
});
