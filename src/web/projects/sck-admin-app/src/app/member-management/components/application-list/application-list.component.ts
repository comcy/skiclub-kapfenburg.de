import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MembershipApplication } from '../../domain/membership-application';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';

// Now its own routed tab (Anträge) rather than a section nested under the
// Mitglieder tab - "Als Mitglied übernehmen" navigates straight to the
// modal member editor (aux route) with the application's data prefilled,
// same as member-list's edit/create buttons.
@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);
    private readonly memberChanges = inject(MemberChangesService);

    public applications$!: Observable<MembershipApplication[]>;
    public displayedColumns: string[] = ['name', 'email', 'submittedAt', 'confirmed', 'actions'];

    // takeUntilDestroyed() needs an injection context - throws NG0203 inside ngOnInit().
    private readonly changesSubscription = this.memberChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.refresh());

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.applications$ = this.dataService.getMembershipApplications();
        this.cdr.markForCheck();
    }

    onPromote(application: MembershipApplication): void {
        this.router.navigate([{ outlets: { modal: ['mitglieder-bearbeiten', 'neu'] } }], {
            queryParams: { antragId: application.registrationId },
        });
    }
}
