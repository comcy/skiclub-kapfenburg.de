import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationItem } from 'projects/shared-lib/src/public-api';

@Component({
  selector: 'app-site-navigation',
  templateUrl: './site-navigation.component.html',
  styleUrls: ['./site-navigation.component.scss'],
})
export class SiteNavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @Input() navItems: NavigationItem[] = [];


  routerHome() {
    this.router.navigateByUrl('');
  }

  routeTo(routeLink: string) {
    this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
  }
}
