import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

type InviteState = 'loading' | 'invalid' | 'ready' | 'accepted';

@Component({
    selector: 'app-invite-accept',
    standalone: true,
    imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './invite-accept.component.html',
    styleUrl: './invite-accept.component.scss',
})
export class InviteAcceptComponent implements OnInit {
    private readonly auth = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private token = '';

    public state: InviteState = 'loading';
    public email = '';

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

    acceptAndRequestMagicLink(): void {
        this.auth.acceptInvite(this.token).subscribe({
            next: () => {
                this.auth.requestMagicLink(this.email).subscribe();
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
