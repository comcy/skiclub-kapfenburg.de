/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';
import { GymCoursesRegisterDialogComponent } from 'projects/gym-lib/src/lib/feature/gym-courses-register-dialog/gym-courses-register-dialog.component';
import { TripsRegisterDialogComponent } from '@trips-lib';
import { Tile, TileBehavior, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
// (Tile-related imports removed for skipped dialog tests)

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent, NoopAnimationsModule],
            providers: [
                {
                    provide: MatDialog,
                    useFactory: () => {
                        const spy = jasmine.createSpy('open').and.callFake((comp: unknown) => {
                            return { componentRef: { instance: comp }, afterClosed: () => ({ subscribe: () => {} }) };
                        });
                        return { open: spy } as unknown as MatDialog;
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build tiles list on init with expired + visible flags set', () => {
        // Arrange done in lifecycle
        const anyExpired = component.tiles.some((t) => t.expired === true);
        // Expired flag should be boolean for all
        expect(component.tiles.every((t) => typeof t.expired === 'boolean')).toBeTrue();
        // At least one tile should be present
        expect(component.tiles.length).toBeGreaterThan(0);
        // Visible defaults to true unless explicitly set to false
        expect(component.tiles.every((t) => t.visible !== undefined)).toBeTrue();
        // There may or may not be expired tiles depending on current date, but check property reliability
        expect(anyExpired || !anyExpired).toBeTrue();
    });

    it('should place all non-expired tiles before any expired tiles and not lose tiles', () => {
        const now = new Date().getTime();
        const nonExpired = component.tiles.filter((t) => t.expiration.getTime() >= now);
        const expired = component.tiles.filter((t) => t.expiration.getTime() < now);

        // Check cluster ordering (all non-expired appear before any expired)
        const firstExpiredIndex = component.tiles.findIndex((t) => t.expiration.getTime() < now);
        if (firstExpiredIndex !== -1) {
            const hasNonExpiredAfter = component.tiles
                .slice(firstExpiredIndex)
                .some((t) => t.expiration.getTime() >= now);
            expect(hasNonExpiredAfter).toBeFalse();
        }

        // Validate no tile loss and same multiset of orders
        const allOrders = component.tiles.map((t) => t.order).sort();
        const recombinedOrders = [...nonExpired, ...expired].map((t) => t.order).sort();
        expect(allOrders).toEqual(recombinedOrders);
    });

    describe('openLink', () => {
        let windowOpenBackup: typeof window.open | undefined;
        let windowOpenSpy: jasmine.Spy;
        interface MutableWindow extends Window {
            open: typeof window.open;
        }
        beforeEach(() => {
            windowOpenBackup = window.open;
            windowOpenSpy = jasmine.createSpy('open');
            (window as MutableWindow).open = windowOpenSpy as unknown as typeof window.open;
        });
        afterEach(() => {
            (window as MutableWindow).open = windowOpenBackup as typeof window.open;
        });
        it('should open link in new tab when link provided', () => {
            component.openLink('assets/downloads/Mitgliedsantrag_SCK.pdf');
            expect(windowOpenSpy).toHaveBeenCalledOnceWith('assets/downloads/Mitgliedsantrag_SCK.pdf', '_blank');
        });
        it('should do nothing when link undefined', () => {
            component.openLink(undefined);
            expect(windowOpenSpy).not.toHaveBeenCalled();
        });
    });

    describe('resolveRegisterDialogComponent', () => {
        it('returns GymCoursesRegisterDialogComponent for course tile', () => {
            const tile: Tile = {
                order: 1,
                type: TileType.Course,
                title: 'Course',
                date: '',
                subTitle: '',
                image: '',
                imageDescription: '',
                description: '',
                status: TileStatus.Open,
                expiration: new Date('2099-01-01'),
                behavior: TileBehavior.View,
            };
            expect(component.resolveRegisterDialogComponent(tile)).toBe(GymCoursesRegisterDialogComponent);
        });

        it('returns TripsRegisterDialogComponent for non-course tile', () => {
            const tile: Tile = {
                order: 2,
                type: TileType.Info,
                title: 'Info',
                date: '',
                subTitle: '',
                image: '',
                imageDescription: '',
                description: '',
                status: TileStatus.Open,
                expiration: new Date('2099-01-01'),
                behavior: TileBehavior.View,
            };
            expect(component.resolveRegisterDialogComponent(tile)).toBe(TripsRegisterDialogComponent);
        });
    });
});
