/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ANGULAR_MATERIAL_MODULES, ANGULAR_MODULES, NavigationItem } from '../../../components';

@Component({
    selector: 'shared-lib-site-footer',
    imports: [ANGULAR_MODULES, ANGULAR_MATERIAL_MODULES],
    templateUrl: './site-footer.component.html',
    styleUrls: ['./site-footer.component.scss'],
})
export class SiteFooterComponent {
    @Input() color = 'primary';
    @Input() navItems: NavigationItem[] = [];

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
