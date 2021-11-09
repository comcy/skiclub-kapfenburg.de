/*
 * Copyright:
 *
 * Skiclub Kapfenburg e.V.
 * http://www.skiclub-kapfenburg.de
 *
 * This source code file is part of skiclub-kapfenburg.de.
 *
 * Copyright (c) 2019 - 2021 Christian Silfang (comcy) - All Rights Reserved.
 *  
 *
 * Created on 21. October 2021
 *
 */



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getYear } from 'date-fns'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

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
    this.router.navigate(['../datenschutz'], { relativeTo: this.route })
  };

  routerImpressum() {
    this.router.navigate(['../impressum'], { relativeTo: this.route })

  };

}
