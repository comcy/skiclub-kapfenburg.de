/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComcyCopyrightComponent } from './comcy-copyright.component';

describe('ComcyCopyrightComponent', () => {
    let component: ComcyCopyrightComponent;
    let fixture: ComponentFixture<ComcyCopyrightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComcyCopyrightComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ComcyCopyrightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
