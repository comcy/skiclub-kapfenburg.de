/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHeaderComponent } from './site-header.component';

describe('SiteHeaderComponent', () => {
    let component: SiteHeaderComponent;
    let fixture: ComponentFixture<SiteHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SiteHeaderComponent],
        });
        fixture = TestBed.createComponent(SiteHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
