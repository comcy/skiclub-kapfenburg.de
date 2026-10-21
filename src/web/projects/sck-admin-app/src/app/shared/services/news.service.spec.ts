import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { NewsService } from './news.service';

describe('NewsService', () => {
    const session = signal<{ newsSince?: string | null } | null>({ newsSince: '2026-10-20T10:00:00.000Z' });
    let service: NewsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthService, useValue: { session, checkSession: () => ({ subscribe: () => undefined }) } },
            ],
        });
        service = TestBed.inject(NewsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('isNew vergleicht gegen newsSince des Admins', () => {
        expect(service.isNew('2026-10-20T10:00:01.000Z')).toBeTrue();
        expect(service.isNew('2026-10-20T09:59:59.000Z')).toBeFalse();
        expect(service.isNew(undefined)).toBeFalse();
    });

    it('isNew ist false ohne newsSince (nichts ist neu)', () => {
        session.set({ newsSince: null });
        expect(service.isNew('2026-10-21T00:00:00.000Z')).toBeFalse();
        session.set({ newsSince: '2026-10-20T10:00:00.000Z' });
    });

    it('lädt die Zähler, sobald eine Session da ist', () => {
        TestBed.tick();
        const req = httpMock.expectOne(`${environment.sckApiUrl}/news`);
        req.flush({
            since: '2026-10-20T10:00:00.000Z',
            trips: { total: 2, byTile: { t1: 2 } },
            courses: { total: 0, byTile: {} },
            applications: 1,
        });
        expect(service.summary()?.trips.total).toBe(2);
        expect(service.newInTile('trips', 't1')).toBe(2);
        expect(service.newInTile('courses', 'x')).toBe(0);
    });
});
