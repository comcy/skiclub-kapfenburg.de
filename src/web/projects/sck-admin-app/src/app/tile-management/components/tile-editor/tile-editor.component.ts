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
import { Tile, TileCreationParams } from '../../domain/tile';
import { Image } from '../../domain/image';
import { TileActions, TileBehavior, TileStatus, TileType } from '../../domain/tile-enums';
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
import { UsersDataService } from '../../../user-management/services/users-data.service';
import { UserDirectoryEntry } from '../../../user-management/domain/user-directory-entry';

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
    @Output() tileSaved = new EventEmitter<void>();

    private readonly dataService = inject(TilesDataService);
    private readonly boardingsService = inject(BoardingsDataService);
    private readonly usersService = inject(UsersDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    public isUploadingImage = false;
    public availableBoardings$: Observable<Boarding[]> | undefined;
    public availableUsers$: Observable<UserDirectoryEntry[]> | undefined;
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

    ngOnInit(): void {
        // Load all boardings/users for the dropdowns (up to 1000)
        this.availableBoardings$ = this.boardingsService.getBoardings(1, 1000).pipe(map((response) => response.items));
        this.availableUsers$ = this.usersService.getUserDirectory();
    }

    ngOnChanges(): void {
        if (this.fixedType === TileType.Course) {
            this.ensureCourseConfigShape();
        } else {
            this.ensureTripConfigShape();
        }
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
    // entirely absent on a brand-new event tile.
    private ensureTripConfigShape(): void {
        if (!this.tile) return;
        this.tile.tripConfig = this.tile.tripConfig ?? {};
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
        if (!enabled) {
            this.tile.tripConfig.pricing = undefined;
            return;
        }
        const zero = () => ({ member: 0, nonMember: 0 });
        const pricing = this.tile.tripConfig.pricing ?? {};
        this.tile.tripConfig.pricing = {
            busLift: {
                adult: pricing.busLift?.adult ?? zero(),
                youthUntil16: pricing.busLift?.youthUntil16 ?? zero(),
                childUntil6: pricing.busLift?.childUntil6 ?? zero(),
            },
            busOnly: pricing.busOnly ?? zero(),
            addons: {
                snowshoes: pricing.addons?.snowshoes ?? zero(),
                technikHalf: pricing.addons?.technikHalf ?? zero(),
                technikFull: pricing.addons?.technikFull ?? zero(),
                courseBeginner: pricing.addons?.courseBeginner ?? zero(),
                courseAdvanced: pricing.addons?.courseAdvanced ?? zero(),
            },
        };
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
