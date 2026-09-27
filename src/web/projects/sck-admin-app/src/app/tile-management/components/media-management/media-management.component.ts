import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../auth/services/auth.service';
import { Image } from '../../domain/image';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-media-management',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './media-management.component.html',
    styleUrls: ['./media-management.component.scss'],
})
export class MediaManagementComponent implements OnInit {
    private readonly dataService = inject(TilesDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    public readonly auth = inject(AuthService);

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    public images: Image[] = [];
    public isLoading = true;
    public isUploading = false;

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.isLoading = true;
        this.dataService.listImages().subscribe({
            next: (images) => {
                this.images = images;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading = false;
                this.cdr.markForCheck();
            },
        });
    }

    resolvedUrl(image: Image): string {
        return this.dataService.getAbsoluteUrl(image.url);
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    onUploadClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        target.value = '';
        if (!file) return;

        this.isUploading = true;
        this.dataService.uploadImage(file).subscribe({
            next: () => {
                this.isUploading = false;
                this.refresh();
            },
            error: () => {
                this.isUploading = false;
                this.cdr.markForCheck();
            },
        });
    }

    onDelete(image: Image): void {
        if (!confirm(`Bild "${image.filename}" löschen?`)) return;
        this.dataService.deleteImage(image.filename).subscribe(() => this.refresh());
    }
}
