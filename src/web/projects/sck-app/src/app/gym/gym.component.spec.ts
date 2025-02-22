/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymComponent } from './gym.component';

describe('GymComponent', () => {
    let component: GymComponent;
    let fixture: ComponentFixture<GymComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GymComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GymComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
