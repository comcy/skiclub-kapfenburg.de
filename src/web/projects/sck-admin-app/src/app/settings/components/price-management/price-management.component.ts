import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { AgeCategory } from 'projects/trips-lib/src/lib/domain/models/trip-base';
import { AuthService } from '../../../auth/services/auth.service';
import { SkiCoursePricingSetting } from '../../domain/ski-course-pricing-setting';
import { TripPricingSetting } from '../../domain/trip-pricing-setting';
import { SettingsDataService } from '../../services/settings-data.service';

const zero = () => ({ member: 0, nonMember: 0 });

// Fixed grouping (Snowboard/Alpin x Erwachsene/Kinder, Bus+Lift x
// Altersgruppe + Zuschläge) - only the price values are admin-editable,
// the row/column structure never changes season to season (see the plan).
@Component({
    selector: 'app-price-management',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './price-management.component.html',
    styleUrls: ['./price-management.component.scss'],
})
export class PriceManagementComponent implements OnInit {
    private readonly dataService = inject(SettingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public skiCoursePricing: SkiCoursePricingSetting = {
        childUntilAge: 16,
        snowboard: { adult: zero(), child: zero() },
        alpine: { adult: zero(), child: zero() },
    };
    public tripPricing: TripPricingSetting = {};

    public isSkiCoursePricingSaved = false;
    public isTripPricingSaved = false;

    public readonly ageCategories: AgeCategory[] = ['adult', 'youthUntil16', 'childUntil6'];
    public readonly ageCategoryLabels: Record<AgeCategory, string> = {
        adult: 'Erwachsene',
        youthUntil16: 'Jugendliche (bis 16 J.)',
        childUntil6: 'Kinder (bis 6 J.)',
    };

    ngOnInit(): void {
        this.dataService.getSkiCoursePricing().subscribe((setting) => {
            this.skiCoursePricing = setting;
            this.cdr.markForCheck();
        });
        this.dataService.getTripPricing().subscribe((setting) => {
            this.tripPricing = this.ensureTripPricingShape(setting);
            this.cdr.markForCheck();
        });
    }

    // The pricing form binds directly into tripPricing.busLift/busOnly/addons.*,
    // so every field it renders needs a real object to bind into - all of
    // TripPricing's fields are optional (public site only fills in what's
    // actually configured), a freshly-loaded/empty setting needs zeroed
    // placeholders instead.
    private ensureTripPricingShape(pricing: TripPricingSetting): TripPricingSetting {
        return {
            busLift: {
                adult: pricing.busLift?.adult ?? zero(),
                youthUntil16: pricing.busLift?.youthUntil16 ?? zero(),
                childUntil6: pricing.busLift?.childUntil6 ?? zero(),
            },
            busOnly: pricing.busOnly ?? zero(),
            addons: {
                snowshoes: pricing.addons?.snowshoes ?? zero(),
                technikHalf: pricing.addons?.technikHalf ?? zero(),
                technikFull: pricing.addons?.technikFull ?? zero(),
                courseBeginner: pricing.addons?.courseBeginner ?? zero(),
                courseAdvanced: pricing.addons?.courseAdvanced ?? zero(),
            },
        };
    }

    onSaveSkiCoursePricing(): void {
        this.isSkiCoursePricingSaved = false;
        this.dataService.updateSkiCoursePricing(this.skiCoursePricing).subscribe(() => {
            this.isSkiCoursePricingSaved = true;
            this.cdr.markForCheck();
        });
    }

    onSaveTripPricing(): void {
        this.isTripPricingSaved = false;
        this.dataService.updateTripPricing(this.tripPricing).subscribe(() => {
            this.isTripPricingSaved = true;
            this.cdr.markForCheck();
        });
    }
}
