import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiliftLib } from './skilift-lib';

describe('SkiliftLib', () => {
    let component: SkiliftLib;
    let fixture: ComponentFixture<SkiliftLib>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SkiliftLib],
        }).compileComponents();

        fixture = TestBed.createComponent(SkiliftLib);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
