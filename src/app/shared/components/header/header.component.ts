/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationItem } from './navigation-item';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() baseRoute = '';
  @Input() navItems: NavigationItem[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routeTo(routeLink: string) { 
    this.router.navigateByUrl(routeLink);
  };

}
