import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly route = inject(ActivatedRoute);

    public email = '';
    public isSending = false;
    public magicLinkSent = false;
    public errorMessage: string | null = null;

    constructor() {
        if (this.route.snapshot.queryParamMap.get('error') === 'auth-failed') {
            this.errorMessage = 'Anmeldung fehlgeschlagen oder Link abgelaufen. Bitte erneut versuchen.';
        }
    }

    requestMagicLink(): void {
        if (!this.email) return;
        this.isSending = true;
        this.errorMessage = null;
        this.auth.requestMagicLink(this.email).subscribe({
            next: () => {
                this.isSending = false;
                this.magicLinkSent = true;
            },
            error: () => {
                this.isSending = false;
                this.errorMessage = 'Anfrage fehlgeschlagen. Bitte später erneut versuchen.';
            },
        });
    }

    loginWithGoogle(): void {
        window.location.href = this.auth.googleLoginUrl();
    }
}
