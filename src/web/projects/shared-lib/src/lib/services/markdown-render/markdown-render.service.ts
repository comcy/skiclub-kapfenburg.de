/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import * as showdown from 'showdown';

const converter = new showdown.Converter({ strikethrough: true, noIntreEmphasis: true });

@Injectable({
    providedIn: 'root',
})
export class MarkdownRenderService {
    render(text: string): string {
        return converter.makeHtml(text);
    }
}
