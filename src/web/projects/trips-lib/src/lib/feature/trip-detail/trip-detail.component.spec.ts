/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TRIP_DATA } from '@data';
import {
    EventTile,
    TileActions,
    TileBehavior,
    TileStatus,
    TileType,
} from 'projects/shared-lib/src/lib/ui-common/models';
import { BehaviorSubject } from 'rxjs';
import { TripRegistrationFormServiceInterface } from '../../ui/trips-registration-form/trips-registration-form.interfaces';
import { TripDetailComponent } from './trip-detail.component';

const TEST_TILE: EventTile = {
    id: 'test-trip-detail-tile',
    order: 0,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'Testausfahrt',
    date: '1. Januar 2099',
    subTitle: 'Testtitel',
    image: 'test.jpg',
    imageDescription: 'test',
    description: 'Eine Testbeschreibung',
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2099-01-02'),
    boardings: ['Teststation (8:00 Uhr)'],
    status: TileStatus.Open,
    tripConfig: { pricing: {} },
};

describe('TripDetailComponent', () => {
    let component: TripDetailComponent;
    let fixture: ComponentFixture<TripDetailComponent>;
    let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

    beforeEach(async () => {
        paramMap$ = new BehaviorSubject(convertToParamMap({}));

        await TestBed.configureTestingModule({
            imports: [TripDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { paramMap: paramMap$ } },
                {
                    provide: TripRegistrationFormServiceInterface,
                    useValue: { sendFormToSheetsIo: () => {}, sendConfirmationMail: () => {} },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TripDetailComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        const index = TRIP_DATA.indexOf(TEST_TILE);
        if (index !== -1) {
            TRIP_DATA.splice(index, 1);
        }
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('shows the not-found state when no trip matches the id', () => {
        paramMap$.next(convertToParamMap({ id: 'does-not-exist' }));
        fixture.detectChanges();

        expect(component.tile).toBeUndefined();
    });

    it('resolves the trip tile and pre-fills the registration data from TRIP_DATA', () => {
        TRIP_DATA.push(TEST_TILE);
        paramMap$.next(convertToParamMap({ id: TEST_TILE.id }));
        fixture.detectChanges();

        expect(component.tile?.id).toBe(TEST_TILE.id);
        expect(component.registrationData).toEqual([
            {
                destination: TEST_TILE.title,
                date: TEST_TILE.date,
                availableBoardings: TEST_TILE.boardings ?? [],
                tripConfig: TEST_TILE.tripConfig,
            },
        ]);
        expect(component.description).toContain(TEST_TILE.description);
        expect(component.description).toContain('Abfahrtszeiten');
    });
});
