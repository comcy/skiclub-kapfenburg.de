import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { Boarding } from '../../domain/boarding';
import { BoardingsDataService } from '../../services/boardings-data.service';
import { BoardingEditDialogComponent } from '../boarding-edit-dialog/boarding-edit-dialog.component';

@Component({
    selector: 'app-boarding-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
    template: `
        <div class="header">
            <h2>Boardings</h2>
            @if (auth.hasPermission('boardings:write')) {
                <button mat-raised-button color="primary" (click)="onCreate()">
                    <mat-icon>add</mat-icon> Create New Boarding
                </button>
            }
        </div>

        <table mat-table [dataSource]="(boardings$ | async) || []" class="mat-elevation-z8">
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let boarding">{{ boarding.name }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let boarding">
                    @if (auth.hasPermission('boardings:write')) {
                        <button mat-icon-button color="primary" (click)="onEdit(boarding)">
                            <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="onDelete(boarding)">
                            <mat-icon>delete</mat-icon>
                        </button>
                    }
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
            [length]="totalItems"
            [pageSize]="pageSize"
            [pageIndex]="pageIndex"
            [pageSizeOptions]="[5, 10, 20]"
            (page)="onPageChange($event)"
            showFirstLastButtons
        >
        </mat-paginator>
    `,
    styles: [
        `
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            table {
                width: 100%;
            }
        `,
    ],
})
export class BoardingListComponent implements OnInit {
    private readonly dataService = inject(BoardingsDataService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly dialog = inject(MatDialog);
    public readonly auth = inject(AuthService);

    public boardings$!: Observable<Boarding[]>;
    public displayedColumns: string[] = ['name', 'actions'];

    public totalItems = 0;
    public pageSize = 10;
    public pageIndex = 0;

    ngOnInit(): void {
        this.refresh();
    }

    // Zoneless change detection (see app.config.ts) doesn't track a plain
    // HttpClient subscribe callback - refresh() is also called from
    // onDelete()'s async callback, so mark here to cover both call sites.
    refresh(): void {
        this.boardings$ = this.dataService.getBoardings(this.pageIndex + 1, this.pageSize).pipe(
            tap((response) => (this.totalItems = response.total)),
            map((response) => response.items),
        );
        this.cdr.markForCheck();
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.refresh();
    }

    onCreate(): void {
        this.openEditor({ id: '', name: '' });
    }

    onEdit(boarding: Boarding): void {
        this.openEditor({ ...boarding });
    }

    private openEditor(boarding: Boarding): void {
        const dialogRef = this.dialog.open(BoardingEditDialogComponent, {
            data: { boarding },
            width: '480px',
            maxWidth: '95vw',
        });
        dialogRef.afterClosed().subscribe((changed: boolean | undefined) => {
            if (changed) this.refresh();
        });
    }

    onDelete(boarding: Boarding): void {
        if (confirm(`Delete boarding "${boarding.name}"?`)) {
            this.dataService.deleteBoarding(boarding.id).subscribe(() => this.refresh());
        }
    }
}
