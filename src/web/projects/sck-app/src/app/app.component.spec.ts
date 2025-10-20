/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have the configured title`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('Skiclub Kapfenburg e.V.');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const app = fixture.componentInstance;
        expect(app.title).toBeDefined();
    });
});
