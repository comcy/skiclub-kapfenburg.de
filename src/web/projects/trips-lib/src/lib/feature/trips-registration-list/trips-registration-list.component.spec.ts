import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegistrationListComponent } from './trips-registration-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TripsRegistrationListComponent', () => {
    let component: TripsRegistrationListComponent;
    let fixture: ComponentFixture<TripsRegistrationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripsRegistrationListComponent, HttpClientTestingModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({
                            get: () => 'test-id',
                        }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TripsRegistrationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
