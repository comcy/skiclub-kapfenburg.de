import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesRegistrationDetailComponent } from './courses-registration-detail.component';

describe('CoursesRegistrationDetailComponent', () => {
    let component: CoursesRegistrationDetailComponent;
    let fixture: ComponentFixture<CoursesRegistrationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesRegistrationDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesRegistrationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
