/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsBannerComponent } from './news-banner.component';

describe('NewsBannerComponent', () => {
    let component: NewsBannerComponent;
    let fixture: ComponentFixture<NewsBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewsBannerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
