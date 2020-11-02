import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Images } from './state/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  headerImgPath = '/assets/img/header/';
  contentImgPath = '/assets/img/content/';

  headerImages = ["01.jpeg", "02.jpg", "03.jpg", "04.jpeg", "05.jpg", "06.jpg", "07.jpg"];
  contentImages = ["01.jpeg", "02.jpeg", "03.jpeg", "04.jpeg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg"];

  constructor(private store: Store) { }


  async ngOnInit(): Promise<void> {

    console.log('app component');

    await this.loadImages();

  }

  private async loadImages(): Promise<boolean> {

    console.log('load images');

    const images = {
      headerImage: this.headerImgPath + this.getHeaderImage(),
      firstContentImage: this.contentImgPath + this.getContentImage(),
      secondContentImage: this.contentImgPath + this.getContentImage(),

    }
    this.store.dispatch(new Images(images));

    return true;
  }

  private getHeaderImage(): string {
    return this.getRandomElement(this.headerImages);
  }

  private getContentImage() {
    return this.getRandomElement(this.contentImages);
  }

  private getRandomElement(elements: string[]): string {
    const random = Math.floor(Math.random() * elements.length);
    return elements[random];
  }

}
