/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Images, MobileResolution, NewsVisibility } from 'src/app/state/app.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Select(AppState.getImages) images$;
  //@Select(AppState.getNewsVisibilityStatus) news$;

  // isNewsVisible: boolean;

  baseRoute: string = 'desktop';

  title = 'Skiclub Kapfenburg e.V.';
  subtitle = 'Herzlich Willkomen';

  headerImgPath = '/assets/img/header/';
  contentImgPath = '/assets/img/content/';

  headerImages = ['01.jpeg', '02.jpg', '03.jpg', '04.jpeg', '05.jpg', '06.jpg', '07.jpg'];
  contentImages = ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg'];


  oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';

  headerImg = '';
  contentImgOne = '';
  contentImgTwo = '';

  constructor(private store: Store, private router: Router) { }


  async ngOnInit(): Promise<void> {

    await this.loadImages();
    //
    // this.news$.subscribe((visible) => {
    //   this.isNewsVisible = false; // visible; --> disabled NEWS banner
    // });

    this.images$.subscribe((images) => {
      this.headerImg = images.headerImage;
      this.contentImgOne = images.firstContentImage;
      this.contentImgTwo = images.secondContentImage;
    });
  }

  private async loadImages(): Promise<boolean> {

    const images = {
      headerImage: this.headerImgPath + this.getHeaderImage(),
      firstContentImage: this.contentImgPath + this.getContentImage(),
      secondContentImage: this.contentImgPath + this.getContentImage()

    };

    this.store.dispatch(new Images(images));

    return true;
  }

  private getHeaderImage(): string {
    return this.getRandomElement(this.headerImages);
  }

  private getContentImage(): string {
    return this.getRandomElement(this.contentImages);
  }

  private getRandomElement(elements: string[]): string {
    const random = Math.floor(Math.random() * elements.length);
    return elements[random];
  }

  //
  // ngOnInit(): void {
  //
  //   this.news$.subscribe((visible) => {
  //     this.isNewsVisible = false; // visible; --> disabled NEWS banner
  //   });
  //
  //   this.images$.subscribe((images) => {
  //     this.headerImg = images.headerImage;
  //     this.contentImgOne = images.firstContentImage;
  //     this.contentImgTwo = images.secondContentImage;
  //   });
  //
  // }

  // public closeNews(): void {
  //   const news = { visibility: false };
  //   this.store.dispatch(new NewsVisibility(news));
  // }

  public routerSki(): void {
    this.router.navigateByUrl('skischule');
  }

}
