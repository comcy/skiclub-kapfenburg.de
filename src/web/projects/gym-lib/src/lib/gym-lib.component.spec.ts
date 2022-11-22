import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymLibComponent } from './gym-lib.component';

describe('GymLibComponent', () => {
  let component: GymLibComponent;
  let fixture: ComponentFixture<GymLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GymLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
