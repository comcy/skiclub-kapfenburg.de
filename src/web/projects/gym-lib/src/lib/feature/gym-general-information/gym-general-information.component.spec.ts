/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GymGeneralInformationComponent } from './gym-general-information.component';

describe('GymGeneralInformationComponent', () => {
    let component: GymGeneralInformationComponent;
    let fixture: ComponentFixture<GymGeneralInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GymGeneralInformationComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GymGeneralInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the two Pilates course tiles', () => {
        expect(component.pilatesTiles.length).toBe(2);
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelectorAll('.gym-tile-clickable').length).toBe(2);
    });

    it('should display the public offer tiles (no registration)', () => {
        expect(component.offerTiles.length).toBe(3);
        const compiled = fixture.nativeElement as HTMLElement;
        const allTileCards = compiled.querySelectorAll('.gym-tile-card').length;
        expect(allTileCards).toBe(component.pilatesTiles.length + component.offerTiles.length);
    });
});
