/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TurnstileWidgetComponent } from 'projects/shared-lib/src/lib/ui-common/components/turnstile-widget/turnstile-widget.component';
import { NewsletterSignupService } from '../../services/business/newsletter-signup.service';

@Component({
    selector: 'app-newsletter-signup-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TurnstileWidgetComponent,
    ],
    templateUrl: './newsletter-signup-dialog.component.html',
    styleUrls: ['./newsletter-signup-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class NewsletterSignupDialogComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly newsletterService = inject(NewsletterSignupService);

    public turnstileSiteKey = this.newsletterService.getTurnstileSiteKey();
    public turnstileToken: string | null = null;
    public isSending = false;
    public done = false;

    public form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
    });

    onTurnstileToken(token: string | null): void {
        this.turnstileToken = token;
    }

    isSubmitDisabled(): boolean {
        return !this.form.valid || !this.turnstileToken || this.isSending;
    }

    submit(): void {
        if (!this.form.valid || !this.turnstileToken) return;

        this.isSending = true;
        this.newsletterService.signup(this.form.controls.email.getRawValue() as string, this.turnstileToken).subscribe({
            next: () => {
                this.isSending = false;
                this.done = true;
            },
            error: () => {
                this.isSending = false;
            },
        });
    }
}
