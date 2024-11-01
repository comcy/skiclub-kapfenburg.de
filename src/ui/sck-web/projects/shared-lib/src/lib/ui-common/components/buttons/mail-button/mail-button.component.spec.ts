import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailButtonComponent } from './mail-button.component';

describe('MailButtonComponent', () => {
    let component: MailButtonComponent;
    let fixture: ComponentFixture<MailButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MailButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MailButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
