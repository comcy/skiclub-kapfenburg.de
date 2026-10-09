import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { SettingsDataService } from '../../services/settings-data.service';
import { PriceManagementComponent } from './price-management.component';

describe('PriceManagementComponent', () => {
    let component: PriceManagementComponent;
    let fixture: ComponentFixture<PriceManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PriceManagementComponent, HttpClientTestingModule],
            providers: [
                {
                    provide: SettingsDataService,
                    useValue: {
                        getSkiCoursePricing: () =>
                            of({
                                childUntilAge: 16,
                                snowboard: {
                                    adult: { member: 55, nonMember: 70 },
                                    child: { member: 45, nonMember: 60 },
                                },
                                alpine: { adult: { member: 60, nonMember: 75 }, child: { member: 50, nonMember: 65 } },
                            }),
                        // Only busOnly/courseBeginner set on purpose - exercises
                        // ensureTripPricingShape()'s zero-fill for everything else.
                        getTripPricing: () => of({ busOnly: { member: 30, nonMember: 30 } }),
                        updateSkiCoursePricing: (setting: unknown) => of(setting),
                        updateTripPricing: (setting: unknown) => of(setting),
                    },
                },
                { provide: AuthService, useValue: { hasPermission: () => true } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PriceManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loads the ski-course pricing as-is', () => {
        expect(component.skiCoursePricing.snowboard.adult).toEqual({ member: 55, nonMember: 70 });
    });

    it('zero-fills the missing trip-pricing fields so the form always has something to bind into', () => {
        expect(component.tripPricing.busLift?.adult).toEqual({ member: 0, nonMember: 0 });
        expect(component.tripPricing.busOnly).toEqual({ member: 30, nonMember: 30 });
        expect(component.tripPricing.addons?.snowshoes).toEqual({ member: 0, nonMember: 0 });
    });

    it('marks ski-course pricing as saved after a successful save', () => {
        component.onSaveSkiCoursePricing();
        expect(component.isSkiCoursePricingSaved).toBe(true);
    });
});
