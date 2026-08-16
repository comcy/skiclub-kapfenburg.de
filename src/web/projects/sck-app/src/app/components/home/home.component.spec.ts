/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'projects/sck-app/src/environments/environment';

// Fixture tiles as returned by GET {sckApiUrl}/tiles, standing in for the sck-api
// backend. Home used to read these straight out of `projects/data` at compile
// time; it now fetches them at runtime (see TilesApiService), so tests flush this
// through HttpTestingController instead of relying on static imports.
const API_TILES_RESPONSE = {
    total: 4,
    items: [
        {
            id: 'expired-event',
            order: 0,
            type: 'event',
            title: 'Alte Ausfahrt',
            date: '2000-01-01',
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: 'open',
            expiration: '2000-01-02',
            behavior: 'view',
            actions: ['register'],
        },
        {
            id: 'course-1',
            order: 1,
            type: 'course',
            title: 'Pilates',
            date: '2099-01-01',
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: 'open',
            expiration: '2099-01-02',
            behavior: 'view',
            actions: ['register'],
        },
        {
            id: 'info-1',
            order: 2,
            type: 'info',
            title: 'Infoseite',
            date: '2099-01-01',
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: 'open',
            expiration: '2099-01-02',
            behavior: 'view',
            actions: [],
        },
        {
            id: 'membership-1',
            order: 3,
            type: 'info',
            title: 'Mitgliedschaft',
            date: '2099-01-01',
            subTitle: '',
            image: '',
            imageDescription: '',
            description: '',
            status: 'open',
            expiration: '2099-01-02',
            behavior: 'click',
            actions: ['download'],
            downloadActionLink: 'assets/downloads/Mitgliedsantrag_SCK.pdf',
        },
    ],
};

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent, NoopAnimationsModule, HttpClientTestingModule],
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

        httpMock = TestBed.inject(HttpTestingController);
        httpMock.expectOne((req) => req.url === `${environment.sckApiUrl}/tiles`).flush(API_TILES_RESPONSE);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build tiles list from the API response with expired + visible flags set', () => {
        expect(component.tiles.length).toBe(API_TILES_RESPONSE.items.length);
        expect(component.tiles.every((t) => typeof t.expired === 'boolean')).toBeTrue();
        expect(component.tiles.every((t) => t.visible === true)).toBeTrue();
        expect(component.tiles.some((t) => t.expired === true)).toBeTrue();
    });

    it('should place all non-expired tiles before any expired tiles and not lose tiles', () => {
        const now = new Date().getTime();
        const firstExpiredIndex = component.tiles.findIndex((t) => t.expiration.getTime() < now);
        expect(firstExpiredIndex).toBeGreaterThan(-1);

        const hasNonExpiredAfter = component.tiles.slice(firstExpiredIndex).some((t) => t.expiration.getTime() >= now);
        expect(hasNonExpiredAfter).toBeFalse();

        expect(component.tiles.map((t) => t.id).sort()).toEqual(API_TILES_RESPONSE.items.map((t) => t.id).sort());
    });

    it('course tile should carry the Register action', () => {
        const courseTile = component.tiles.find((t) => t.id === 'course-1');
        expect(courseTile?.actions).toContain('register' as never);
    });

    it('info tile without actions should not have the Register action', () => {
        const infoTile = component.tiles.find((t) => t.id === 'info-1');
        expect(infoTile?.actions ?? []).not.toContain('register' as never);
    });

    it('click-behavior download tile should carry its download link', () => {
        const membershipTile = component.tiles.find((t) => t.id === 'membership-1');
        expect(membershipTile?.downloadActionLink).toBe('assets/downloads/Mitgliedsantrag_SCK.pdf');
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
});
