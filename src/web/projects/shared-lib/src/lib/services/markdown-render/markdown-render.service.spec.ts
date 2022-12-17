import { TestBed } from '@angular/core/testing';

import { MarkdownRenderService } from './markdown-render.service';

describe('MarkdownRenderService', () => {
  let service: MarkdownRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
