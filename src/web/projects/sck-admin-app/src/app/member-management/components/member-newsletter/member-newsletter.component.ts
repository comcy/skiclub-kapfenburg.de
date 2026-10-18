import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NewsletterSignup } from '../../domain/newsletter-signup';
import { MembersDataService } from '../../services/members-data.service';

@Component({
    selector: 'app-member-newsletter',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
    templateUrl: './member-newsletter.component.html',
    styleUrls: ['./member-newsletter.component.scss'],
})
export class MemberNewsletterComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public signups: NewsletterSignup[] = [];
    public loaded = false;
    public displayedColumns: string[] = ['email', 'createdAt', 'actions'];

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.dataService.getNewsletterSignups().subscribe((signups) => {
            this.signups = signups;
            this.loaded = true;
            this.cdr.markForCheck();
        });
    }

    onDelete(signup: NewsletterSignup): void {
        if (!confirm(`Newsletter-Anmeldung von ${signup.email} löschen?`)) return;
        this.dataService.deleteNewsletterSignup(signup.id).subscribe(() => this.refresh());
    }

    // No export precedent anywhere in this repo (see the plan) - a client-
    // side Blob download of the already-loaded list is the smallest diff,
    // no backend CSV endpoint needed.
    onExport(): void {
        const rows = ['E-Mail,Angemeldet am', ...this.signups.map((s) => `${s.email},${s.createdAt}`)];
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'newsletter-anmeldungen.csv';
        link.click();
        URL.revokeObjectURL(url);
    }
}
