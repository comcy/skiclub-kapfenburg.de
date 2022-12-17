import { Injectable } from '@angular/core';

// const showdown = require('showdown');
// const converter = new showdown.Converter();

@Injectable({
  providedIn: 'root',
})
export class MarkdownRenderService {
  constructor() {}

  render(text: string): string {
    // return converter.makeHtml(text);
  }
}
