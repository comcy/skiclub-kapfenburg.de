import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsInformationComponent } from './trips-information.component';

describe('TripsInformationComponent', () => {
  let component: TripsInformationComponent;
  let fixture: ComponentFixture<TripsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
