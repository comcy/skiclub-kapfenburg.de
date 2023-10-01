/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

export interface AppStateModel {
  images: AppImagesState;
  news: NewsState;
  resolution: MobileResolutionState;
}

export interface AppImagesState {
  headerImage: string;
  firstContentImage: string;
  secondContentImage: string;
}

export interface NewsState {
  visibility: boolean;
}

export interface MobileResolutionState {
  isMobileResolution: boolean;
}
