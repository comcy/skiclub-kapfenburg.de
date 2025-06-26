/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { marked } from 'marked';

marked.setOptions({
    gfm: true, // GitHub Flavored Markdown (aktiviert Strikethrough & Tables)
    breaks: false,
});

@Injectable({
    providedIn: 'root',
})
export class MarkdownRenderService {
    render(text: string): string {
        return marked.parse(text) as string;
    }
}
