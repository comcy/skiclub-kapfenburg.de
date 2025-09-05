import { TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { BreakpointObserverService } from './breakpoint-observer.service';

describe('BreakpointObserverService', () => {
    let service: BreakpointObserverService;
    let observerSpy: jasmine.SpyObj<BreakpointObserver>;

    beforeEach(() => {
        observerSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
        const state = { matches: true, breakpoints: {} } as const;
        observerSpy.observe.and.returnValue(of(state));
        TestBed.configureTestingModule({
            providers: [BreakpointObserverService, { provide: BreakpointObserver, useValue: observerSpy }],
        });
        service = TestBed.inject(BreakpointObserverService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should emit handset true when breakpoint matches', (done) => {
        service.handsetBreakpoint$.subscribe((value) => {
            expect(value).toBeTrue();
            done();
        });
    });
});
