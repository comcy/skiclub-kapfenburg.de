import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesRegistrationTableComponent } from './courses-registration-table.component';

describe('CoursesRegistrationTableComponent', () => {
    let component: CoursesRegistrationTableComponent;
    let fixture: ComponentFixture<CoursesRegistrationTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesRegistrationTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesRegistrationTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
