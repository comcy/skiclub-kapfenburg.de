import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Select(AppState.getImages) images$;

  newsVisible = true;

  title = 'Skiclub Kapfenburg e.V.';
  subtitle = 'Herzlich Willkomen';

  headerImg = '';
  contentImgOne = '';
  contentImgTwo = '';

  constructor() { }

  ngOnInit(): void {

    console.log('home component');

    this.images$.subscribe((images) => {

      console.log('images ', images);

      this.headerImg = images.headerImage;
      this.contentImgOne = images.firstContentImage;
      this.contentImgTwo = images.secondContentImage;
    });

  }

  closeNews() {
    this.newsVisible = false;
  }

}
