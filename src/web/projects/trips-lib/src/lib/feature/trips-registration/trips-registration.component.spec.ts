import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegistrationComponent } from './trips-registration.component';

describe('TripsRegistrationComponent', () => {
  let component: TripsRegistrationComponent;
  let fixture: ComponentFixture<TripsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
