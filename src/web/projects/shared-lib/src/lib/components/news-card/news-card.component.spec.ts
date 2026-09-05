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
            imports: [NewsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsCardComponent);
        component = fixture.componentInstance;
        // newsCardItem is a required @Input read in ngOnInit - must be set
        // before the first detectChanges() triggers it.
        component.newsCardItem = { title: 'Test-Titel', content: 'Test-Inhalt' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('derives headerText/contentText from the newsCardItem input', () => {
        expect(component.headerText).toBe('Test-Titel');
        expect(component.contentText).toBe('Test-Inhalt');
    });
});
