import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymCoursesRegisterDialogComponent } from './gym-courses-register-dialog.component';

describe('GymCoursesRegisterDialogComponent', () => {
    let component: GymCoursesRegisterDialogComponent;
    let fixture: ComponentFixture<GymCoursesRegisterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GymCoursesRegisterDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GymCoursesRegisterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
