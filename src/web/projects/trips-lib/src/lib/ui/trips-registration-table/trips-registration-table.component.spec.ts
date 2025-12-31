import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegistrationTableComponent } from './trips-registration-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('TripsRegistrationTableComponent', () => {
    let component: TripsRegistrationTableComponent;
    let fixture: ComponentFixture<TripsRegistrationTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripsRegistrationTableComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TripsRegistrationTableComponent);
        component = fixture.componentInstance;
        component.registrations$ = of([]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
