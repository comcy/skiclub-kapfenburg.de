import { TestBed } from '@angular/core/testing';
import { MarkdownRenderService } from './markdown-render.service';

describe('MarkdownRenderService', () => {
    let service: MarkdownRenderService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MarkdownRenderService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should render markdown to HTML', () => {
        const html = service.render('# Title');
        expect(html).toContain('<h1');
        expect(html).toContain('Title');
    });
});
