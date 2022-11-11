import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRegisterDialogComponent } from './trip-register-dialog.component';

describe('TripRegisterDialogComponent', () => {
  let component: TripRegisterDialogComponent;
  let fixture: ComponentFixture<TripRegisterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripRegisterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
