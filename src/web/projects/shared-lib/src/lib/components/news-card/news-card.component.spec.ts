/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardComponent } from './news-card.component';

describe('NewsCardComponent', () => {
    let component: NewsCardComponent;
    let fixture: ComponentFixture<NewsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
