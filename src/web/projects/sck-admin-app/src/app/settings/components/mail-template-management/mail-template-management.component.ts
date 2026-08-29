import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Reuses the exact substitution logic the public site uses to send these
// mails, so the preview can never drift from what a subscriber actually gets.
import { renderTemplate } from 'projects/data/mail-templates/template-engine';
import { AuthService } from '../../../auth/services/auth.service';
import { MailTemplateSettings } from '../../domain/mail-template-setting';
import { SettingsDataService } from '../../services/settings-data.service';

interface PlaceholderInfo {
    token: string;
    description: string;
    sampleValue: string;
}

const EMPTY_TEXT = { introHtml: '', termsHtml: '', signatureHtml: '' };

@Component({
    selector: 'app-mail-template-management',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './mail-template-management.component.html',
    styleUrls: ['./mail-template-management.component.scss'],
})
export class MailTemplateManagementComponent implements OnInit {
    private readonly dataService = inject(SettingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly sanitizer = inject(DomSanitizer);
    public readonly auth = inject(AuthService);

    public mailTemplates: MailTemplateSettings = {
        course: { ...EMPTY_TEXT },
        trip: { ...EMPTY_TEXT, waitlistHtml: '' },
        gym: { ...EMPTY_TEXT },
    };

    public readonly exampleToken = '{{firstName}}';

    public isCourseSaved = false;
    public isTripSaved = false;
    public isGymSaved = false;

    public readonly coursePlaceholders: PlaceholderInfo[] = [
        { token: 'firstName', description: 'Vorname', sampleValue: 'Anna' },
        { token: 'lastName', description: 'Nachname', sampleValue: 'Beispiel' },
        { token: 'sportType', description: 'Sportart', sampleValue: 'Snowboard' },
        { token: 'level', description: 'Kursstufe', sampleValue: 'Anfängerkurs' },
        { token: 'birthday', description: 'Geburtsdatum', sampleValue: '01.01.2015' },
        { token: 'email', description: 'E-Mail', sampleValue: 'anna@example.com' },
        { token: 'phone', description: 'Telefon', sampleValue: '0170 1234567' },
        { token: 'additionalText', description: 'Zusatzangaben aus dem Formular', sampleValue: 'Ist Linksfüßer.' },
    ];

    public readonly tripPlaceholders: PlaceholderInfo[] = [
        { token: 'firstName', description: 'Vorname (Ansprechpartner)', sampleValue: 'Max' },
        { token: 'destination', description: 'Ziel der Ausfahrt', sampleValue: 'Ehrwald' },
        { token: 'date', description: 'Datum der Ausfahrt', sampleValue: '23.01.2027' },
        { token: 'totalPrice', description: 'Berechneter Gesamtpreis (formatiert)', sampleValue: '135,00 €' },
        { token: 'additionalText', description: 'Zusatzangaben aus dem Formular', sampleValue: 'Fährt mit dem Kind.' },
    ];

    public readonly tripWaitlistPlaceholders: PlaceholderInfo[] = [
        ...this.tripPlaceholders,
        {
            token: 'waitlistGroupText',
            description: 'Gruppengröße, z.B. "1 Person"/"2 Personen"',
            sampleValue: '2 Personen',
        },
        { token: 'waitlistPosition', description: 'Position auf der Warteliste', sampleValue: '3' },
    ];

    public readonly gymPlaceholders: PlaceholderInfo[] = [
        { token: 'firstName', description: 'Vorname', sampleValue: 'Lisa' },
        { token: 'lastName', description: 'Nachname', sampleValue: 'Muster' },
        { token: 'courseName', description: 'Kursname', sampleValue: 'Pilates' },
        { token: 'courseDate', description: 'Kurstermin', sampleValue: 'Dienstags, 19 Uhr' },
        { token: 'priceMember', description: 'Preis für Mitglieder', sampleValue: '40' },
        { token: 'priceNonMember', description: 'Preis für Nicht-Mitglieder', sampleValue: '60' },
        { token: 'additionalText', description: 'Zusatzangaben aus dem Formular', sampleValue: '' },
    ];

    ngOnInit(): void {
        this.dataService.getMailTemplates().subscribe((settings) => {
            this.mailTemplates = settings;
            this.cdr.markForCheck();
        });
    }

    // Kept as a function (not inlined `{{ '{{' + p.token + '}}' }}` in the
    // template) because a literal `{{`/`}}` pair next to a real Angular
    // interpolation in the same text node confuses the template parser.
    wrapToken(token: string): string {
        return `{{${token}}}`;
    }

    private samplesOf(placeholders: PlaceholderInfo[]): Record<string, string> {
        return Object.fromEntries(placeholders.map((p) => [p.token, p.sampleValue]));
    }

    private preview(html: string, placeholders: PlaceholderInfo[]): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(renderTemplate(html, this.samplesOf(placeholders)));
    }

    previewCourse(field: 'introHtml' | 'termsHtml' | 'signatureHtml'): SafeHtml {
        return this.preview(this.mailTemplates.course[field], this.coursePlaceholders);
    }

    previewTrip(field: 'introHtml' | 'termsHtml' | 'signatureHtml' | 'waitlistHtml'): SafeHtml {
        const placeholders = field === 'waitlistHtml' ? this.tripWaitlistPlaceholders : this.tripPlaceholders;
        return this.preview(this.mailTemplates.trip[field], placeholders);
    }

    previewGym(field: 'introHtml' | 'termsHtml' | 'signatureHtml'): SafeHtml {
        return this.preview(this.mailTemplates.gym[field], this.gymPlaceholders);
    }

    onSaveCourse(): void {
        this.isCourseSaved = false;
        this.dataService.updateMailTemplates(this.mailTemplates).subscribe(() => {
            this.isCourseSaved = true;
            this.cdr.markForCheck();
        });
    }

    onSaveTrip(): void {
        this.isTripSaved = false;
        this.dataService.updateMailTemplates(this.mailTemplates).subscribe(() => {
            this.isTripSaved = true;
            this.cdr.markForCheck();
        });
    }

    onSaveGym(): void {
        this.isGymSaved = false;
        this.dataService.updateMailTemplates(this.mailTemplates).subscribe(() => {
            this.isGymSaved = true;
            this.cdr.markForCheck();
        });
    }
}
