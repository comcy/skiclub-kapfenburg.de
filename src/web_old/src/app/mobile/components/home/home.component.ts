/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';

  constructor() {}

  ngOnInit(): void {}
}
