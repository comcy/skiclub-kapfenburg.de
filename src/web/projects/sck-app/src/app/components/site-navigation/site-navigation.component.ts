/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationItem } from 'projects/shared-lib/src/public-api';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/services';

@Component({
    selector: 'app-site-navigation',
    templateUrl: './site-navigation.component.html',
    styleUrls: ['./site-navigation.component.scss'],
})
export class SiteNavigationComponent {
    @Input() navTitle = '';
    @Input() navItems: NavigationItem[] = [];
    @Input() highlightedNavItems?: NavigationItem[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public breakpointObserver: BreakpointObserverService,
    ) {}

    routerHome() {
        this.router.navigateByUrl('');
    }

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
