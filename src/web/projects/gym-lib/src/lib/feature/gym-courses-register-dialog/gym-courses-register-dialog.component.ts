import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { GymCourse } from '../../domain/models/gym-course';
import { GymCoursesRegistrationFormComponent } from '../../ui/gym-courses-registration-form.component';
import { GymCourseDialogData } from './gym-course-register-dialog.interfaces';

@Component({
    selector: 'lib-gym-courses-register-dialog',
    imports: [CommonModule, ComponentsModule, GymCoursesRegistrationFormComponent],
    templateUrl: './gym-courses-register-dialog.component.html',
    styleUrl: './gym-courses-register-dialog.component.scss',
    standalone: true,
})
export class GymCoursesRegisterDialogComponent implements OnInit {
    @Output() public handleConfirmClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    public dialogTitle!: string;
    public tripDate!: string;
    public gymCourseDetails$: BehaviorSubject<GymCourse[]> = new BehaviorSubject([
        {
            name: '',
        },
    ]);
    public gymCourseDetails!: GymCourse[];
    public boardingList!: string[];

    private dialogRef = inject(MatDialogRef<GymCoursesRegisterDialogComponent>);
    public data = inject<GymCourseDialogData>(MAT_DIALOG_DATA);

    ngOnInit(): void {
        const tile = this.data.tile;

        this.dialogTitle = `${tile.title}`;

        this.gymCourseDetails$.next([
            {
                name: tile.title,
            },
        ]);

        this.gymCourseDetails = [
            {
                name: tile.title,
            },
        ];
    }

    public onGymCourseRegistrationFormSubmit(success: boolean): void {
        if (success) {
            this.handleConfirmClicked.emit(true);
            this.dialogRef.close();
        }
    }
}
