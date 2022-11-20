import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesInformationComponent } from './courses-information.component';

describe('CoursesInformationComponent', () => {
  let component: CoursesInformationComponent;
  let fixture: ComponentFixture<CoursesInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
