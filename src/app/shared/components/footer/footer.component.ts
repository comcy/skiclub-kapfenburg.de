/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getYear } from 'date-fns'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() baseRoute = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  getYear(): string {
    return getYear(new Date()).toString();
  }


  routerDatenschutz() {
    console.log(' >>> BR ', this.baseRoute);
    this.router.navigate([this.baseRoute, 'datenschutz'])
  };

  routerImpressum() {
    console.log(' >>> BR ', this.baseRoute);
    this.router.navigate([this.baseRoute, 'impressum'])

  };

}
