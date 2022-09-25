import { ElementRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nativeElement'
})
export class NativeElementPipe implements PipeTransform {

  transform(element: ElementRef, value: string) {
    element.nativeElement.innerHTML = value;
    }

}
