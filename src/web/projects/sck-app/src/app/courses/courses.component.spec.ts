/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CourseTilesApiServiceInterface } from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import { of } from 'rxjs';

import { CoursesComponent } from './courses.component';

describe('CoursesComponent', () => {
    let component: CoursesComponent;
    let fixture: ComponentFixture<CoursesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, CoursesComponent],
            providers: [
                {
                    provide: CourseTilesApiServiceInterface,
                    useValue: {
                        getAllCourseTiles: () => of([]),
                        getSkiCoursePricing: () =>
                            of({
                                childUntilAge: 16,
                                snowboard: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
                                alpine: { adult: { member: 0, nonMember: 0 }, child: { member: 0, nonMember: 0 } },
                            }),
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
