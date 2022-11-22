import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsLibComponent } from './trips-lib.component';

describe('TripsLibComponent', () => {
  let component: TripsLibComponent;
  let fixture: ComponentFixture<TripsLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
