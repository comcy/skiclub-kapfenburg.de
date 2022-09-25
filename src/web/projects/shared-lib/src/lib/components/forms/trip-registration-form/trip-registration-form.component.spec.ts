import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRegistrationFormComponent } from './trip-registration-form.component';

describe('TripRegistrationFormComponent', () => {
  let component: TripRegistrationFormComponent;
  let fixture: ComponentFixture<TripRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripRegistrationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
