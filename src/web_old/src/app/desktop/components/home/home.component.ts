/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card, CardType } from '@shared-lib/*';
import { Select, Store } from '@ngxs/store';
import {
  DESKTOP_BASE_ROUTE,
  SKISCHULE_ROUTE_SEGMENT,
} from 'src/app/route-segments';
import { Images } from 'src/app/state/app.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Select(AppState.getImages) images$;

  public hrefSkischuleRouteSegment = SKISCHULE_ROUTE_SEGMENT;
  public title = 'Skiclub Kapfenburg e.V.';
  public downloadTitle = 'Programm 21/22';
  public subtitle = 'Herzlich Willkomen';
  public headerImgPath = '/assets/img/header/';
  public contentImgPath = '/assets/img/content/';
  public oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';
  public headerImg = '';
  public contentImgOne = '';
  public contentImgTwo = '';
  public contentImgThree = '';
  public headerImages = [
    '01.jpeg',
    '02.jpg',
    '03.jpg',
    '04.jpeg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
  ];
  public contentImages = [
    '01.jpeg',
    '02.jpeg',
    '03.jpeg',
    '04.jpeg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
    '08.jpg',
    '09.jpg',
    '10.jpg',
  ];

  public cards: Card[] = [
    {
      title: 'Ausfahrt 1',
      text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.<br> Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.<br> Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
      active: true,
      image: '06.jpg',
      type: CardType.News,
      date: '1. Januar 2022',
    },
    {
      title: 'Ausfahrt 2',
      text: 'Pellentesque ggggggggggggggggggggggggggggg habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.<br> Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.<br> Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
      active: true,
      image: 'header/03.jpg',
      type: CardType.News,
      date: '10. Januar 2022',
    },
    {
      title: 'Ausfahrt 3',
      text: 'Gibts ned',
      active: false,
      image: 'header/05.jpg',
      type: CardType.News,
      date: '10. Januar 2022',
    },
    {
      title: 'Ausfahrt 4',
      text: 'Gibts nedaasssss',
      active: true,
      image: null,
      imageUrl:
        'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260',
      type: CardType.News,
      date: '10. Januar 2022',
    },
    {
      title: 'Ausfahrt 4',
      text: 'Gibts ned',
      active: true,
      image: './01.jpeg',
      type: CardType.Image,
    },
    {
      title: 'Ausfahrt 4',
      text: 'Gibts ned',
      active: true,
      image: './01.jpeg',
      type: CardType.News,
    },
    {
      title: 'Ausfahrt 4',
      text: 'Gibts ned',
      active: true,
      image: './01.jpeg',
      type: CardType.News,
    },
  ];

  constructor(private store: Store, private router: Router) {}

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
      this.contentImgThree = images.thirdContentImage;
    });
  }

  public routerTermine(): void {
    this.router.navigateByUrl('termine');
  }

  private async loadImages(): Promise<boolean> {
    const images = {
      headerImage: this.headerImgPath + this.getHeaderImage(),
      firstContentImage: this.contentImgPath + this.getContentImage(),
      secondContentImage: this.contentImgPath + this.getContentImage(),
      thirdContentImage: this.contentImgPath + this.getContentImage(),
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
}
