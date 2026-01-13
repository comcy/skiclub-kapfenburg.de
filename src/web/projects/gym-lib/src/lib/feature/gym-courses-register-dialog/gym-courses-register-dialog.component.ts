/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { GymCourseInformation } from '../../domain/models/gym-course-information';
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
    public eventDate!: string;
    public gymCourseDetails$: BehaviorSubject<GymCourseInformation[]> = new BehaviorSubject([
        {
            name: '',
            description: '',
            time: '',
            location: '',
            contact: '',
        },
    ]);
    public gymCourseDetails!: GymCourseInformation[];
    public data = inject<GymCourseDialogData>(MAT_DIALOG_DATA);

    private dialogRef = inject(MatDialogRef<GymCoursesRegisterDialogComponent>);

    ngOnInit(): void {
        const tile = this.data.tile;
        this.dialogTitle = `${tile.title}`;
        this.eventDate = `${tile.date}`;
        this.gymCourseDetails$.next([
            {
                name: tile.course.name,
                description: tile.course.description,
                date: tile.course.date,
                time: tile.course.time,
                location: tile.course.location,
                prices: {
                    member: tile.course.prices?.member ?? '',
                    nonMember: tile.course.prices?.nonMember ?? '',
                },
                contact: tile.course.contact,
            },
        ]);
    }

    public onGymCourseRegistrationFormSubmit(success: boolean): void {
        if (success) {
            this.handleConfirmClicked.emit(true);
            this.dialogRef.close();
        }
    }
}
