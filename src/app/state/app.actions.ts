import { AppImagesState, NewsState } from "./app-state";

export class Images {
  static readonly type = '[App] Set Images';
  constructor(public images: AppImagesState) { }
}

export class NewsVisibility {
  static readonly type = '[App] Set News Visibility';
  constructor(public visibility: boolean) { }
}