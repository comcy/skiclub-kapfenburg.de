import { AppImages } from "./app-state";

export class Images {
  static readonly type = '[App] Set Images';
  constructor(public images: AppImages) { }
}
