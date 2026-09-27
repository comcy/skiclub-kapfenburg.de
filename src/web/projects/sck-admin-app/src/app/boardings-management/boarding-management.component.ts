import { Component } from '@angular/core';
import { BoardingListComponent } from './components/boarding-list/boarding-list.component';

@Component({
    selector: 'app-boarding-management',
    standalone: true,
    imports: [BoardingListComponent],
    template: `
        <div class="container">
            <app-boarding-list></app-boarding-list>
        </div>
    `,
    styles: [
        `
            .container {
                display: flex;
                flex-direction: column;
                flex: 1;
                min-height: 0;
                padding: 16px;
            }
        `,
    ],
})
export class BoardingManagementComponent {}
