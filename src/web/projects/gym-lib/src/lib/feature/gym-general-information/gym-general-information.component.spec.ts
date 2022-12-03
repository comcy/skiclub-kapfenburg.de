import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymGeneralInformationComponent } from './gym-general-information.component';

describe('GeneralInformationComponent', () => {
  let component: GymGeneralInformationComponent;
  let fixture: ComponentFixture<GymGeneralInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymGeneralInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GymGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
