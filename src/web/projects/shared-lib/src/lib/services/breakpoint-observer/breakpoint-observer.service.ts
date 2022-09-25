import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointObserverService {
  private isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  get handsetBreakpoint$(): Observable<boolean> {
    return this.isHandset$;
  }

  constructor(private breakpointObserver: BreakpointObserver) {}
}
