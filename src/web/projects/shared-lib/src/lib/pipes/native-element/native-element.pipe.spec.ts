/**
 * @copyright Copyright (c) 2019 Christian Silfang
 * Tests for NativeElementPipe
 */
import { ElementRef } from '@angular/core';
import { NativeElementPipe } from './native-element.pipe';

describe('NativeElementPipe', () => {
    it('create an instance', () => {
        const pipe = new NativeElementPipe();
        expect(pipe).toBeTruthy();
    });

    it('should set innerHTML of the native element', () => {
        const nativeEl: { innerHTML: string } = { innerHTML: '' };
        const elementRef = { nativeElement: nativeEl } as unknown as ElementRef;
        const pipe = new NativeElementPipe();

        pipe.transform(elementRef, '<b>Hello</b>');

        expect(nativeEl.innerHTML).toBe('<b>Hello</b>');
    });
});
