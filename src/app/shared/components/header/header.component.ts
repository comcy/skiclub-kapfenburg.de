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
 * Created on 08. November 2021
 *
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routerHome() { 
    this.router.navigateByUrl('')
  };

  routerSki() { 
    this.router.navigateByUrl('skischule')
  };
  
  routerFahrt() {
    this.router.navigateByUrl('ausfahrten')
   };
  
  routerGym() {
    this.router.navigateByUrl('gymnastik')
   };

}
