import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SckLogoIconComponent } from './sck-logo-icon.component';

describe('SckLogoIconComponent', () => {
    let component: SckLogoIconComponent;
    let fixture: ComponentFixture<SckLogoIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SckLogoIconComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SckLogoIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
