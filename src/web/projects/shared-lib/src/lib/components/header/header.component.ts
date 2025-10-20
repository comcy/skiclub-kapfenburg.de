/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationItem } from './header.interfaces';
import { NgFor } from '@angular/common';

@Component({
    selector: 'shared-lib-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [NgFor],
})
export class HeaderComponent {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    @Input() navItems: NavigationItem[] = [];

    routerHome() {
        this.router.navigateByUrl('');
    }

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
