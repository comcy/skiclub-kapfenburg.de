import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'shared-lib-sck-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: [MatButtonModule, MatIconModule],
    standalone: true,
})
export class NotFoundComponent {
    private router = inject(Router);

    public redirectToHome() {
        this.router.navigateByUrl('/');
    }
}
