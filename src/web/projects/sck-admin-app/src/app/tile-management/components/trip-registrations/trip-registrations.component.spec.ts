import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
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
    selfReportedIsMember: false,
    status: 'confirmed',
    source: 'manual',
    orderIndex: 0,
    transferredToExternalList: false,
    confirmationMailSent: false,
    busOnly: false,
    snowshoes: false,
    courseRequested: false,
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
                { provide: AuthService, useValue: { hasPermission: () => true, session: () => null } },
                { provide: MatDialog, useValue: jasmine.createSpyObj<MatDialog>('MatDialog', ['open']) },
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

        it('marks confirmed registrations beyond capacity (by signup time) as Notplätze', () => {
            component.tile = { capacity: 2, emergencySeats: 2 } as never;
            component.registrations = [
                makeRegistration({ id: 'c', createdAt: '2026-01-03T00:00:00Z' }),
                makeRegistration({ id: 'a', createdAt: '2026-01-01T00:00:00Z' }),
                makeRegistration({ id: 'b', createdAt: '2026-01-02T00:00:00Z' }),
                makeRegistration({ id: 'w', status: 'waitlist', createdAt: '2026-01-04T00:00:00Z' }),
            ];

            expect([...component.emergencyRegistrationIds]).toEqual(['c']);
            expect(component.emergencyUsed).toBe(1);
        });
    });

    describe('tileStatusLabel (Anmeldungs-Metadaten)', () => {
        it('is "Abgesagt" for a canceled tile, even if full', () => {
            component.tile = { status: component.tileStatusEnum.Canceled, capacity: 1 } as never;
            component.registrations = [makeRegistration()];

            expect(component.tileStatusLabel).toBe('Abgesagt');
        });

        it('is "Warteliste" for the manual BookedUp status', () => {
            component.tile = { status: component.tileStatusEnum.BookedUp } as never;
            component.registrations = [];

            expect(component.tileStatusLabel).toBe('Warteliste');
        });

        it('is "Warteliste" once confirmed registrations reach capacity, even without the manual flag', () => {
            component.tile = { status: component.tileStatusEnum.Open, capacity: 1 } as never;
            component.registrations = [makeRegistration()];

            expect(component.tileStatusLabel).toBe('Warteliste');
        });

        it('is "Offen" when open and below capacity', () => {
            component.tile = { status: component.tileStatusEnum.Open, capacity: 2 } as never;
            component.registrations = [makeRegistration()];

            expect(component.tileStatusLabel).toBe('Offen');
        });
    });

    describe('sheetRow (Zeilen-Kopie fürs Vereins-Sheet)', () => {
        it('liefert 11 Spalten in der Reihenfolge der sichtbaren Sheet-Spalten', () => {
            const reg = makeRegistration({
                firstName: 'Max',
                lastName: 'Muster',
                birthday: '2000-05-10',
                phone: '0170 1',
                snowshoes: true,
                boardingName: 'Ellwangen',
            });
            component.pricesByRegistrationId.set(reg.id, 45.5);

            const cols = component.sheetRow(reg).split('\t');

            expect(cols.length).toBe(11);
            expect(cols[0]).toBe('Muster, Max');
            expect(cols[1]).toBe('');
            expect(cols[2]).toMatch(/^\d+$/);
            expect(cols[3]).toBe('0170 1');
            expect(cols[4]).toBe('ja');
            expect(cols[5]).toBe('45,5');
            expect(cols[9]).toBe('Ellwangen');
            expect(cols[10]).toBe('');
        });
    });
});
