import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
    let component: SiteFooterComponent;
    let fixture: ComponentFixture<SiteFooterComponent>;

    beforeEach(() => {
        // Injects Router/ActivatedRoute - provideRouter([]) satisfies both
        // without needing real routes for this smoke test.
        TestBed.configureTestingModule({
            imports: [SiteFooterComponent],
            providers: [provideRouter([])],
        });
        fixture = TestBed.createComponent(SiteFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
