/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getYear } from 'date-fns';

@Component({
    selector: 'shared-lib-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    private router = inject(Router);

    @Input() baseRoute = '';

    getYear(): string {
        return getYear(new Date()).toString();
    }

    routerDatenschutz() {
        this.router.navigate([this.baseRoute, 'datenschutz']);
    }

    routerImpressum() {
        this.router.navigate([this.baseRoute, 'impressum']);
    }
}
