/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ElementRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nativeElement',
    standalone: false,
})
export class NativeElementPipe implements PipeTransform {
    transform(element: ElementRef, value: string) {
        element.nativeElement.innerHTML = value;
    }
}
