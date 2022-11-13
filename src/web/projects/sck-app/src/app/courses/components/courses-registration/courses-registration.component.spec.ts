import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesRegistrationComponent } from './courses-registration.component';

describe('CoursesRegistrationComponent', () => {
  let component: CoursesRegistrationComponent;
  let fixture: ComponentFixture<CoursesRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
