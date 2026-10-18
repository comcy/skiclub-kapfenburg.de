import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GERMAN_DATE_FORMATS, GermanDateAdapter } from 'projects/shared-lib/src/lib/date-time';
import { CollapsibleFiltersComponent } from '../../../shared/components/collapsible-filters/collapsible-filters.component';
import { AnniversaryGroup, Member } from '../../domain/member';
import { MembersDataService } from '../../services/members-data.service';

const toIsoDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

@Component({
    selector: 'app-member-anniversaries',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        CollapsibleFiltersComponent,
    ],
    providers: [
        { provide: DateAdapter, useClass: GermanDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
    templateUrl: './member-anniversaries.component.html',
    styleUrls: ['./member-anniversaries.component.scss'],
})
export class MemberAnniversariesComponent {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public stichtag = new Date();
    public yearsText = '25, 40';
    public groups: AnniversaryGroup[] | null = null;
    public isLoading = false;
    public error: string | null = null;
    public searched = false;

    onSearch(): void {
        const years = this.yearsText
            .split(',')
            .map((value) => parseInt(value.trim(), 10))
            .filter((value) => !isNaN(value) && value > 0);

        if (years.length === 0) {
            this.error = 'Mindestens eine gültige Jahreszahl angeben.';
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.dataService.getAnniversaries(toIsoDate(this.stichtag), years).subscribe({
            next: (groups) => {
                this.groups = groups;
                this.searched = true;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.error = 'Jubiläumsliste konnte nicht geladen werden.';
                this.isLoading = false;
                this.cdr.markForCheck();
            },
        });
    }

    onMarkHonored(group: AnniversaryGroup, member: Member): void {
        this.dataService.markHonored(member.id, group.years).subscribe(() => {
            // Optimistic removal from this group's list - a fresh onSearch()
            // would drop them too (now honored for this year-count), no
            // reason to make the admin re-run the search to see it.
            group.members = group.members.filter((m) => m.id !== member.id);
            this.cdr.markForCheck();
        });
    }
}
