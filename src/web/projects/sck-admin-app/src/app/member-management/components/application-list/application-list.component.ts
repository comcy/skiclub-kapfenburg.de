import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { MembershipApplication } from '../../domain/membership-application';
import { MembersDataService } from '../../services/members-data.service';

@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
    private readonly dataService = inject(MembersDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Output() promote = new EventEmitter<MembershipApplication>();

    public applications$!: Observable<MembershipApplication[]>;
    public displayedColumns: string[] = ['name', 'email', 'submittedAt', 'confirmed', 'actions'];

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.applications$ = this.dataService.getMembershipApplications();
        this.cdr.markForCheck();
    }

    onPromote(application: MembershipApplication): void {
        this.promote.emit(application);
    }
}
