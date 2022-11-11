import { Component, Input } from '@angular/core';
import { getYear } from 'date-fns';

@Component({
  selector: 'lib-comcy-copyright',
  templateUrl: './comcy-copyright.component.html',
  styleUrls: ['./comcy-copyright.component.scss'],
})
export class ComcyCopyrightComponent {
  @Input() link!: string;
  @Input() name!: string;

  constructor() {
    this.link = 'https://github.com/comcy';
    this.name = 'comcy';
  }

  getYear(): string {
    return getYear(new Date()).toString();
  }
}
