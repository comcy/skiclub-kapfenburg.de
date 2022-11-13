import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesPricesComponent } from './courses-prices.component';

describe('CoursePricesComponent', () => {
  let component: CoursesPricesComponent;
  let fixture: ComponentFixture<CoursesPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesPricesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
