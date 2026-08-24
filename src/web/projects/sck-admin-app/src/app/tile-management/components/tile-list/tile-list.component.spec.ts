import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { TileType } from '../../domain/tile-enums';
import { TilesDataService } from '../../services/tiles-data.service';
import { TileListComponent } from './tile-list.component';

describe('TileListComponent', () => {
    let component: TileListComponent;
    let fixture: ComponentFixture<TileListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TileListComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
                { provide: Router, useValue: { navigate: () => {} } },
                { provide: TilesDataService, useValue: { getTiles: () => of({ items: [], total: 0 }) } },
                { provide: AuthService, useValue: { hasPermission: () => true } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TileListComponent);
        component = fixture.componentInstance;
    });

    describe('createButtonLabel', () => {
        it('is "Event erstellen" without a fixedType (Ausfahrten-Bereich)', () => {
            component.fixedType = undefined;
            expect(component.createButtonLabel).toBe('Event erstellen');
        });

        it('is "Kurs erstellen" when fixedType is Course (Kurse-Bereich)', () => {
            component.fixedType = TileType.Course;
            expect(component.createButtonLabel).toBe('Kurs erstellen');
        });
    });
});
