import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseIconComponent } from './base-icon.component';
import { BASE_ICON_PROPERTIES } from './base-icon.interfaces';

describe('BaseIconComponent', () => {
    let component: BaseIconComponent;
    let fixture: ComponentFixture<BaseIconComponent>;

    beforeEach(async () => {
        // BaseIconComponent is never used bare - every real usage is a
        // subclass (e.g. SckLogoIconComponent) that provides this token
        // itself. Provide it here the same way, so the component under
        // test actually has what it injects in its constructor.
        await TestBed.configureTestingModule({
            imports: [BaseIconComponent],
            providers: [
                {
                    provide: BASE_ICON_PROPERTIES,
                    useValue: { iconName: 'test-icon', iconPath: 'assets/test-icon.svg' },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
