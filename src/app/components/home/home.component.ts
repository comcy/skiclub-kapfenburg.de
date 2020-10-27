import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'Skiclub Kapfenburg e.V.';
  subtitle = 'Herzlich Willkomen';

  headerImgPath = '/assets/img/header/';
  contentImgPath = '/assets/img/content/';

  headerImages = ["1.jpeg", "2.jpg", "3.jpg"];
  contentImages = ["01.jpeg", "02.jpeg", "03.jpeg", "04.jpeg", "05.jpg"];

  headerImg = '';
  contentImgOne = '';
  contentImgTwo = '';

  constructor() { }

  ngOnInit(): void {

    this.headerImg = this.headerImgPath + this.getHeaderImage();
    this.contentImgOne = this.contentImgPath + this.getContentImage();
    this.contentImgTwo = this.contentImgPath + this.getContentImage();

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
