import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstagramButtonComponent } from './instagram-button.component';

describe('InstagramButtonComponent', () => {
    let component: InstagramButtonComponent;
    let fixture: ComponentFixture<InstagramButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstagramButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InstagramButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
