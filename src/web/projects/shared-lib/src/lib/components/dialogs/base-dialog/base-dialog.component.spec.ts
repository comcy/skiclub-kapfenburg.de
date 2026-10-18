/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { BaseDialogComponent } from './base-dialog.component';

describe('BaseDialogComponent', () => {
    let component: BaseDialogComponent;
    let fixture: ComponentFixture<BaseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BaseDialogComponent],
            providers: [{ provide: MatDialogRef, useValue: { close: () => undefined } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
