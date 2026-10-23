import { Component, Input, inject, OnInit, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TileCardComponent } from '@shared/ui-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { AgeCategory } from 'projects/trips-lib/src/lib/domain/models/trip-base';
import type { TripConfig } from 'projects/trips-lib/src/lib/domain/models/trip-config';
import { getVisibleAgeCategories } from 'projects/trips-lib/src/lib/domain/models/trip-price-table';
import { TeachingTeamEntry, Tile, TileCreationParams } from '../../domain/tile';
import { Image } from '../../domain/image';
import { TileActions, TileBehavior, TileKind, TileStatus, TileType } from '../../domain/tile-enums';
import { toSharedTile } from '../../domain/to-shared-tile';
import { TilesDataService } from '../../services/tiles-data.service';
import { EditableDateComponent } from '../editable-date/editable-date.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';
import { EditableLinkComponent } from '../editable-link/editable-link.component';
import { EditableTextareaComponent } from '../editable-textarea/editable-textarea.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { BoardingsDataService } from '../../../boardings-management/services/boardings-data.service';
import { Boarding } from '../../../boardings-management/domain/boarding';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
    selector: 'app-tile-editor',
    standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        EditableTextComponent,
        EditableTextareaComponent,
        EditableImageComponent,
        EditableLinkComponent,
        EditableDateComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        TileCardComponent,
    ],
    templateUrl: './tile-editor.component.html',
    styleUrls: ['./tile-editor.component.scss'],
})
export class TileEditorComponent implements OnInit, OnChanges {
    @Input() tile: Tile | null = null;
    @Input() fixedType: TileType | undefined;
    // Karten-Management-Reiter (Ausfahrt/Event/Info) - legt Typ und Anmeldung fest, kein Type-/Anmeldung-Feld.
    @Input() kind: TileKind | undefined;
    @Output() tileSaved = new EventEmitter<void>();

    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public isUploadingImage = false;
    public availableBoardings$: Observable<Boarding[]> | undefined;
    public teachingTeam$: Observable<TeachingTeamEntry[]> | undefined;
    public isShowingPreview = false;

    public readonly tileTypes = Object.values(TileType);
    public readonly tileStatus = Object.values(TileStatus);
    public readonly tileBehaviors = Object.values(TileBehavior);
    public readonly tileActions = Object.values(TileActions);

    public readonly ageCategories: AgeCategory[] = ['adult', 'youthUntil16', 'childUntil6'];
    public readonly ageCategoryLabels: Record<AgeCategory, string> = {
        adult: 'Erwachsene',
        youthUntil16: 'Jugendliche (bis 16 J.)',
        childUntil6: 'Kinder (bis 6 J.)',
    };

    // "Nur Erwachsene" (Issue #198/#224) blendet Jugendliche/Kinder-Zeilen
    // im Preisformular aus, analog zur oeffentlichen Anzeige.
    public readonly visibleAgeCategories = (tripConfig: TripConfig | undefined): AgeCategory[] =>
        getVisibleAgeCategories(tripConfig);

    ngOnInit(): void {
        // Load all boardings/users for the dropdowns (up to 1000)
        this.availableBoardings$ = this.boardingsService.getBoardings(1, 1000).pipe(map((response) => response.items));
        this.teachingTeam$ = this.dataService.getTeachingTeam();
    }

    ngOnChanges(): void {
        this.applyKind();
        if (this.fixedType === TileType.Course) {
            this.ensureCourseConfigShape();
        } else if (this.kind !== 'event' && this.kind !== 'info') {
            this.ensureTripConfigShape();
        }
    }

    // Der Reiter bestimmt Typ und Anmeldung: Ausfahrt = event + register, Event = event ohne register, Info = info.
    private applyKind(): void {
        if (!this.tile || !this.kind) return;
        this.tile.type = this.kind === 'info' ? TileType.Info : TileType.Event;
        if (this.kind === 'trip') this.onRegistrationEnabledChange(true);
        else if (this.kind === 'event') this.onRegistrationEnabledChange(false);
    }

    // Kurse section (fixedType===Course) only needs a BCC config, not the
    // full pricing shape - see courseConfig in the trip-registration-plan
    // follow-up.
    private ensureCourseConfigShape(): void {
        if (!this.tile) return;
        this.tile.courseConfig = this.tile.courseConfig ?? {};
    }

    public readonly weekdayLabels = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    public readonly weekdays = [0, 1, 2, 3, 4, 5, 6];

    // schedule.excludedDates is a string[] of ISO dates - the input binds to
    // a plain comma-separated string, same pattern as the BCC lists.
    get excludedDatesText(): string {
        return this.tile?.course?.schedule?.excludedDates?.join(', ') ?? '';
    }

    set excludedDatesText(value: string) {
        if (!this.tile?.course?.schedule) return;
        const dates = value
            .split(',')
            .map((date) => date.trim())
            .filter(Boolean);
        this.tile.course.schedule.excludedDates = dates.length ? dates : undefined;
    }

    onScheduleEnabledChange(enabled: boolean): void {
        if (!this.tile?.course) return;
        this.tile.course.schedule = enabled
            ? (this.tile.course.schedule ?? {
                  weekday: 1,
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString(),
              })
            : undefined;
    }

    // tripConfig is opaque passthrough server-side (extra_json) and may be
    // entirely absent on a brand-new event tile. Pricing selbst wird separat
    // behandelt (siehe normalizePricingShape) - nur wenn es bereits gesetzt
    // ist, nie automatisch neu angelegt (siehe onOwnPricingEnabledChange).
    private ensureTripConfigShape(): void {
        if (!this.tile) return;
        this.tile.tripConfig = this.tile.tripConfig ?? {};
        if (this.tile.tripConfig.pricing) {
            // Migrierte/aeltere Tiles koennen eine unvollstaendige Pricing
            // haben (z.B. kein busOnly, siehe Issue #210-Daten) - jedes
            // Preisfeld im Template bindet non-null-assertiert direkt
            // hinein, deshalb muss die Form schon beim Laden vollstaendig
            // sein, nicht erst beim Checkbox-Toggle (sonst Crash beim
            // Oeffnen eines Tiles mit Teil-Preisen, siehe #219).
            this.tile.tripConfig.pricing = this.normalizePricingShape(this.tile.tripConfig.pricing);
        }
    }

    private normalizePricingShape(
        pricing: NonNullable<Tile['tripConfig']>['pricing'],
    ): NonNullable<NonNullable<Tile['tripConfig']>['pricing']> {
        const zero = () => ({ member: 0, nonMember: 0 });
        return {
            busLift: {
                adult: pricing?.busLift?.adult ?? zero(),
                youthUntil16: pricing?.busLift?.youthUntil16 ?? zero(),
                childUntil6: pricing?.busLift?.childUntil6 ?? zero(),
            },
            // Bewusst NICHT zero-gefuellt wie busLift - "Nur Busfahrt" ist
            // eine echte Opt-in-Option pro Ausfahrt (Issue #227), ihre
            // Praesenz selbst (nicht nur der Preis) steuert, ob die
            // Checkbox im Anmeldeformular ueberhaupt erscheint. Ein
            // bereits vorhandener Wert bleibt beim Laden unangetastet,
            // ein fehlender bleibt fehlend statt automatisch angelegt zu
            // werden - siehe onBusOnlyEnabledChange fuer den bewussten
            // Toggle.
            busOnly: pricing?.busOnly,
            addons: {
                // Opt-in wie busOnly (eigene Checkbox, unabhaengig von hasCourseOption).
                snowshoes: pricing?.addons?.snowshoes,
                technikHalf: pricing?.addons?.technikHalf ?? zero(),
                technikFull: pricing?.addons?.technikFull ?? zero(),
                courseBeginner: pricing?.addons?.courseBeginner ?? zero(),
            },
        };
    }

    // "Nur Busfahrt anbieten" ist ein eigener Opt-in (Issue #227), getrennt
    // vom generellen "Eigene Preise festlegen" - manche Ausfahrten sollen
    // diese Option gar nicht anbieten (z.B. wenn eine reine Busfahrt ohne
    // Skipass fachlich nicht sinnvoll ist). pricing.busOnly selbst (nicht
    // nur ein Preis darin) steuert das in trips-registration-form.component
    // und der Preistabelle.
    // Event MIT Aktion "register" = Ausfahrt (Preise, Kapazitaet, Zustiege, Anmeldeformular); ohne = Termin,
    // zu dem man sich nicht anmeldet (z. B. Skiboerse): nur Bild, Datum, Beschreibung. Andere Typen
    // (Info, Kurs) haben ihre eigene Logik und bleiben unberuehrt.
    get hasRegistration(): boolean {
        if (this.kind) return this.kind === 'trip';
        return this.tile?.type !== TileType.Event || !!this.tile.actions?.includes(TileActions.Register);
    }

    onRegistrationEnabledChange(enabled: boolean): void {
        if (!this.tile) return;
        if (!enabled && !this.tile.actions?.includes(TileActions.Register)) return;
        const actions = (this.tile.actions ?? []).filter((action) => action !== TileActions.Register);
        this.tile.actions = enabled ? [...actions, TileActions.Register] : actions;
    }

    onBusOnlyEnabledChange(enabled: boolean): void {
        if (!this.tile?.tripConfig?.pricing) return;
        this.tile.tripConfig.pricing.busOnly = enabled ? { member: 0, nonMember: 0 } : undefined;
    }

    // Schneeschuhverleih ist pro Ausfahrt ein-/ausschaltbar; addons.snowshoes
    // selbst (Praesenz) steuert den Toggle im Anmeldeformular.
    onSnowshoesEnabledChange(enabled: boolean): void {
        const addons = this.tile?.tripConfig?.pricing?.addons;
        if (!addons) return;
        addons.snowshoes = enabled ? { member: 0, nonMember: 0 } : undefined;
    }

    // Eigene Preise sind ein bewusster Opt-in (Checkbox, siehe Template) statt
    // automatisch bei jedem Oeffnen angelegt - sonst wuerde das blosse
    // Speichern eines Tiles ohne Preis-Interaktion eine nullgefuellte
    // tripConfig.pricing anlegen und damit den globalen Preismanagement-
    // Fallback in trip-tiles-api.service.ts fuer dieses Tile dauerhaft
    // ausser Kraft setzen (hasOwnPricing wird dann true, obwohl der Admin
    // nie wirklich Preise eingetragen hat).
    onOwnPricingEnabledChange(enabled: boolean): void {
        if (!this.tile?.tripConfig) return;
        this.tile.tripConfig.pricing = enabled ? this.normalizePricingShape(this.tile.tripConfig.pricing) : undefined;
    }

    // tile.tripConfig.customBccList is a string[] (see trip-config.ts) - the
    // input binds to a plain comma-separated string instead, same as the
    // getTripConfirmationMailBcc() reader on the sck-app side expects.
    get customBccListText(): string {
        return this.tile?.tripConfig?.customBccList?.join(', ') ?? '';
    }

    set customBccListText(value: string) {
        if (!this.tile?.tripConfig) return;
        const emails = value
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
        this.tile.tripConfig.customBccList = emails.length ? emails : undefined;
    }

    // Same pattern as customBccListText, targeting the Kurse section's
    // courseConfig instead of tripConfig.
    get courseCustomBccListText(): string {
        return this.tile?.courseConfig?.customBccList?.join(', ') ?? '';
    }

    set courseCustomBccListText(value: string) {
        if (!this.tile?.courseConfig) return;
        const emails = value
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
        this.tile.courseConfig.customBccList = emails.length ? emails : undefined;
    }

    togglePreview(): void {
        this.isShowingPreview = !this.isShowingPreview;
    }

    public readonly toSharedTile = toSharedTile;

    public getImageUrl = (imagePath: string | undefined): string => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;

        // Construct absolute URL from relative API path
        // Remove /api from apiUrl if imagePath already starts with /api
        const baseUrl = this.dataService.apiUrl.replace(/\/api$/, '');
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    onImageSelected(file: File): void {
        if (this.tile) {
            this.isUploadingImage = true;
            this.dataService.uploadImage(file).subscribe({
                next: (image: Image) => {
                    this.isUploadingImage = false;
                    if (this.tile) {
                        this.tile.image = image.url;
                        this.tile.imageId = image.id;
                        this.cdr.detectChanges();
                    }
                },
                error: (err: unknown) => {
                    this.isUploadingImage = false;
                    console.error('uploadImage error:', err);
                    this.cdr.detectChanges();
                },
            });
        }
    }
    onImageRemoved(): void {
        if (this.tile) {
            this.tile.image = '';
            this.tile.imageId = undefined;
        }
    }
    onSave(): void {
        if (this.tile) {
            if (this.tile.id.startsWith('new-')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...tile } = this.tile;
                this.dataService.createTile(tile as TileCreationParams).subscribe({
                    next: (savedTile: Tile) => {
                        this.tile = savedTile;
                        this.tileSaved.emit();
                        this.cdr.markForCheck();
                    },
                    error: (err: unknown) => console.error('createTile error:', err),
                });
            } else {
                this.dataService.updateTile(this.tile.id, this.tile).subscribe({
                    next: () => {
                        this.tileSaved.emit();
                        this.cdr.markForCheck();
                    },
                    error: (err: unknown) => console.error('updateTile error:', err),
                });
            }
        }
    }
}
