import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesRegistrationListComponent } from './courses-registration-list.component';

describe('CoursesRegistrationListComponent', () => {
    let component: CoursesRegistrationListComponent;
    let fixture: ComponentFixture<CoursesRegistrationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesRegistrationListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesRegistrationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
