/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { AppImagesState, MobileResolutionState, NewsState } from './app-state';

export class Images {
  static readonly type = '[App] Set Images';
  constructor(public images: AppImagesState) { }
}

export class NewsVisibility {
  static readonly type = '[App] Set News Visibility';
  constructor(public news: NewsState) { }
}

export class MobileResolution {
  static readonly type = '[App] Set Mobile Resolution';
  constructor(public resolution: MobileResolutionState) { }
}
