/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NativeElementPipe } from './native-element.pipe';

describe('NativeElementPipe', () => {
    it('create an instance', () => {
        const pipe = new NativeElementPipe();
        expect(pipe).toBeTruthy();
    });
});
