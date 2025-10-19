/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ANGULAR_MATERIAL_MODULES, ANGULAR_MODULES, NavigationItem } from 'projects/shared-lib/src/public-api';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { SHARED_LIB_ICONS } from '../icons';

@Component({
    imports: [ANGULAR_MODULES, ANGULAR_MATERIAL_MODULES, SHARED_LIB_ICONS],
    selector: 'shared-lib-site-navigation',
    templateUrl: './site-navigation.component.html',
    styleUrls: ['./site-navigation.component.scss'],
})
export class SiteNavigationComponent {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    breakpointObserver = inject(BreakpointObserverService);

    @Input() logo? = '';
    @Input() title = '';
    @Input() navItems: NavigationItem[] = [];
    @Input() highlightedNavItems?: NavigationItem[] = [];

    routerHome() {
        this.router.navigateByUrl('');
    }

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
