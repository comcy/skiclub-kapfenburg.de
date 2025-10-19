/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BreakpointObserverService {
    private breakpointObserver = inject(BreakpointObserver);

    private isHandset$: Observable<boolean>;

    get handsetBreakpoint$(): Observable<boolean> {
        return this.isHandset$;
    }

    constructor() {
        const breakPoints: string[] = [
            Breakpoints.Small,
            Breakpoints.Handset,
            Breakpoints.WebPortrait,
            Breakpoints.TabletPortrait,
        ];

        this.isHandset$ = this.breakpointObserver.observe(breakPoints).pipe(map((result) => result.matches));
    }
}
