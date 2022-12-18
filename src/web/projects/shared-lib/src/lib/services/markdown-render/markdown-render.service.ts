import { Injectable } from '@angular/core';

import * as showdown from 'showdown';
const converter = new showdown.Converter();

@Injectable({
  providedIn: 'root',
})
export class MarkdownRenderService {
  constructor() {}

  render(text: string): string {
    return converter.makeHtml(text);
  }
}
