import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'projects/sck-admin-app/src/environments/environment';
import { TurnstileWidgetComponent } from 'projects/shared-lib/src/lib/ui-common/components/turnstile-widget/turnstile-widget.component';
import { AuthService } from '../services/auth.service';

type InviteState = 'loading' | 'invalid' | 'ready' | 'accepted';

@Component({
    selector: 'app-invite-accept',
    standalone: true,
    imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, TurnstileWidgetComponent],
    templateUrl: './invite-accept.component.html',
    styleUrl: './invite-accept.component.scss',
})
export class InviteAcceptComponent implements OnInit {
    private readonly auth = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private token = '';

    public state: InviteState = 'loading';
    public email = '';
    public turnstileSiteKey = environment.turnstileSiteKey;
    public turnstileToken: string | null = null;

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') ?? '';
        if (!this.token) {
            this.state = 'invalid';
            return;
        }

        this.auth.getInvite(this.token).subscribe({
            next: (invite) => {
                this.email = invite.email;
                this.state = 'ready';
            },
            error: () => (this.state = 'invalid'),
        });
    }

    onTurnstileToken(token: string | null): void {
        this.turnstileToken = token;
    }

    acceptAndRequestMagicLink(): void {
        if (!this.turnstileToken) return;
        this.auth.acceptInvite(this.token).subscribe({
            next: () => {
                this.auth.requestMagicLink(this.email, this.turnstileToken as string).subscribe();
                this.state = 'accepted';
            },
            error: () => (this.state = 'invalid'),
        });
    }

    acceptAndUseGoogle(): void {
        this.auth.acceptInvite(this.token).subscribe({
            next: () => (window.location.href = this.auth.googleLoginUrl()),
            error: () => (this.state = 'invalid'),
        });
    }
}
