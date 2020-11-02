import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routerHome() { 
    this.router.navigateByUrl('')
  };

  routerSki() { 
    this.router.navigateByUrl('skischule')
  };
  
  routerFahrt() {
    this.router.navigateByUrl('ausfahrten')
   };
  
  routerGym() {
    this.router.navigateByUrl('gymnastik')
   };

}
