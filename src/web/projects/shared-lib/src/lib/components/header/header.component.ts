/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationItem } from './header.interfaces';

@Component({
    selector: 'shared-lib-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false,
})
export class HeaderComponent {
    @Input() navItems: NavigationItem[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    routerHome() {
        this.router.navigateByUrl('');
    }

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
