/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationItem } from './header.interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() baseRoute = '';
  @Input() navItems: NavigationItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  routerHome() {
    this.router.navigateByUrl('');
  }

  routeTo(routeLink: string) {
    this.router.navigateByUrl(routeLink);
  }
}
