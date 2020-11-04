import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewsVisibility } from 'src/app/state/app.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Select(AppState.getImages) images$;
  @Select(AppState.getNewsVisibilityStatus) newsVisibility$;

  isNewsVisible: boolean;

  title = 'Skiclub Kapfenburg e.V.';
  subtitle = 'Herzlich Willkomen';

  headerImg = '';
  contentImgOne = '';
  contentImgTwo = '';

  constructor(private store: Store) { }

  ngOnInit(): void {

    console.log('home component');

    this.newsVisibility$.subscribe((visible) => {
      this.isNewsVisible = visible;
    });

    this.images$.subscribe((images) => {
      this.headerImg = images.headerImage;
      this.contentImgOne = images.firstContentImage;
      this.contentImgTwo = images.secondContentImage;
    });

  }

  closeNews() {
    this.store.dispatch(new NewsVisibility(false));
  }

}
