import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardingListComponent } from './components/boarding-list/boarding-list.component';
import { BoardingEditorComponent } from './components/boarding-editor/boarding-editor.component';
import { Boarding } from './domain/boarding';

@Component({
    selector: 'app-boarding-management',
    standalone: true,
    imports: [CommonModule, BoardingListComponent, BoardingEditorComponent],
    template: `
        <div class="container">
            <div class="list-area">
                <app-boarding-list (boardingSelected)="onBoardingSelected($event)" #list></app-boarding-list>
            </div>
            <div class="editor-area" *ngIf="selectedBoarding">
                <app-boarding-editor
                    [boarding]="selectedBoarding"
                    (saved)="onSaved(list)"
                    (cancelled)="selectedBoarding = null"
                ></app-boarding-editor>
            </div>
        </div>
    `,

    styles: [
        `
            .container {
                display: flex;
                gap: 32px;
                padding: 16px;
            }
            .list-area {
                flex: 1;
            }
            .editor-area {
                flex: 1;
                padding-top: 64px;
            }
        `,
    ],
})
export class BoardingManagementComponent {
    selectedBoarding: Boarding | null = null;

    onBoardingSelected(boarding: Boarding): void {
        // Clone to avoid mutating list directly before save
        this.selectedBoarding = { ...boarding };
    }

    onSaved(listComponent: BoardingListComponent): void {
        this.selectedBoarding = null;
        listComponent.refresh();
    }
}
