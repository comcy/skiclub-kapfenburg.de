import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiliftInfoComponent } from './skilift-info.component';

describe('SkiliftInfoComponent', () => {
    let component: SkiliftInfoComponent;
    let fixture: ComponentFixture<SkiliftInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SkiliftInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SkiliftInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
