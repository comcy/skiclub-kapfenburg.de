import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeadingComponent } from '../../../shared/components/page-heading/page-heading.component';
import { Member } from '../../domain/member';
import { MemberChangesService } from '../../services/member-changes.service';
import { MembersDataService } from '../../services/members-data.service';

// Eigene Liste der als "Lehrteam" markierten Mitglieder (Markierung auch in der
// Mitgliederliste/im Mitglieder-Editor). Basis, um Lehrteam-Personen später
// schnell als Verantwortliche einer Ausfahrt zu setzen.
@Component({
    selector: 'app-teaching-team',
    standalone: true,
    imports: [
        PageHeadingComponent,
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './teaching-team.component.html',
    styleUrls: ['./teaching-team.component.scss'],
})
export class TeachingTeamComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly memberChanges = inject(MemberChangesService);
    private readonly cdr = inject(ChangeDetectorRef);

    private allMembers: Member[] = [];
    public team: Member[] = [];
    public addText = '';
    public loaded = false;

    private readonly changesSubscription = this.memberChanges.changed$
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.load());

    ngOnInit(): void {
        this.load();
    }

    private load(): void {
        this.dataService.getMembers(1, 1000).subscribe((response) => {
            this.allMembers = response.items;
            this.team = response.items.filter((m) => m.isTeachingTeam);
            this.loaded = true;
            this.cdr.markForCheck();
        });
    }

    // Vorschläge: aktive Mitglieder, die noch nicht im Lehrteam sind.
    get suggestions(): Member[] {
        const search = this.addText.trim().toLowerCase();
        return this.allMembers
            .filter((m) => !m.isTeachingTeam && m.status === 'active')
            .filter((m) => !search || `${m.firstName} ${m.lastName}`.toLowerCase().includes(search))
            .slice(0, 20);
    }

    label(member: Member): string {
        return `${member.firstName} ${member.lastName}`;
    }

    onAdd(member: Member): void {
        this.addText = '';
        this.set(member, true);
    }

    onRemove(member: Member): void {
        this.set(member, false);
    }

    private set(member: Member, value: boolean): void {
        this.dataService.setTeachingTeam(member, value).subscribe((updated) => {
            this.allMembers = this.allMembers.map((m) => (m.id === updated.id ? updated : m));
            this.team = this.allMembers.filter((m) => m.isTeachingTeam);
            this.cdr.markForCheck();
        });
    }
}
