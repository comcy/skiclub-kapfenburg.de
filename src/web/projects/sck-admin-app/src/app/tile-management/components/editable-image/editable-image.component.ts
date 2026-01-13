import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TilesDataService } from '../../services/tiles-data.service';

@Component({
    selector: 'app-editable-image',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
        <div class="image-wrapper">
            <div class="image-container" (click)="onClick()" [class.has-image]="!!value">
                <img [src]="resolvedUrl" *ngIf="value" />
                <div class="placeholder" *ngIf="!value">
                    <mat-icon class="upload-icon">add_a_photo</mat-icon>
                    <span>Click to upload image</span>
                </div>
                <input
                    type="file"
                    #fileInput
                    (change)="onFileSelected($event)"
                    style="display: none"
                    accept="image/*"
                />
            </div>
            <button
                *ngIf="value"
                mat-icon-button
                color="warn"
                class="remove-btn"
                (click)="onRemove($event)"
                matTooltip="Remove image"
            >
                <mat-icon>delete</mat-icon>
            </button>
        </div>
    `,
    styles: [
        `
            .image-wrapper {
                position: relative;
                width: 100%;
                margin-bottom: 16px;
            }

            .image-container {
                width: 100%;
                height: 200px;
                border: 2px dashed #ccc;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                overflow: hidden;
                background-color: #f9f9f9;
                transition: all 0.2s ease;

                &:hover {
                    border-color: #3f51b5;
                    background-color: #f0f0f5;
                }

                &.has-image {
                    border-style: solid;
                }
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .placeholder {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #777;

                .upload-icon {
                    font-size: 48px;
                    width: 48px;
                    height: 48px;
                    margin-bottom: 8px;
                }
            }

            .remove-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background-color: rgba(255, 255, 255, 0.8);

                &:hover {
                    background-color: white;
                }
            }
        `,
    ],
})
export class EditableImageComponent {
    @Input() value: string | undefined;
    @Output() valueChange = new EventEmitter<string>();
    @Output() imageSelected = new EventEmitter<File>();
    @Output() imageRemoved = new EventEmitter<void>();

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    private readonly dataService = inject(TilesDataService);

    get resolvedUrl(): string {
        return this.dataService.getAbsoluteUrl(this.value);
    }

    onClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length) {
            const file = target.files[0];
            this.imageSelected.emit(file);

            // Reset input value so change event triggers even if same file is selected again
            target.value = '';
        }
    }
    onRemove(event: Event): void {
        event.stopPropagation(); // Prevent triggering the upload click
        this.value = '';
        this.valueChange.emit('');
        this.imageRemoved.emit();
    }
}
