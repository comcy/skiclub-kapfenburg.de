import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegistrationFormComponent } from './trips-registration-form.component';

describe('TripsRegistrationFormComponent', () => {
  let component: TripsRegistrationFormComponent;
  let fixture: ComponentFixture<TripsRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsRegistrationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
