import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth/services/auth.service';
import { SettingsDataService } from './services/settings-data.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    private readonly dataService = inject(SettingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    private customBccList: string[] = [];
    public isSaved = false;

    ngOnInit(): void {
        this.dataService.getNotificationBcc().subscribe((setting) => {
            this.customBccList = setting.customBccList;
            this.cdr.markForCheck();
        });
    }

    // Same comma-separated getter/setter pattern as the tile editor's
    // customBccListText/courseCustomBccListText.
    get globalBccListText(): string {
        return this.customBccList.join(', ');
    }

    set globalBccListText(value: string) {
        this.customBccList = value
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
    }

    onSave(): void {
        this.isSaved = false;
        this.dataService.updateNotificationBcc({ customBccList: this.customBccList }).subscribe(() => {
            this.isSaved = true;
            this.cdr.markForCheck();
        });
    }
}
