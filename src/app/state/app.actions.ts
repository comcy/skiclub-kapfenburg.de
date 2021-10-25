/*
 * Copyright:
 *
 * Skiclub Kapfenburg e.V.
 * http://www.skiclub-kapfenburg.de
 *
 * This source code file is part of skiclub-kapfenburg.de.
 *
 * Copyright (c) 2019 - 2021 Christian Silfang (comcy) - All Rights Reserved.
 *
 *
 * Created on 21. October 2021
 *
 */

import { AppImagesState, MobileResolutionState, NewsState } from './app-state';

export class Images {
  static readonly type = '[App] Set Images';
  constructor(public images: AppImagesState) { }
}

export class NewsVisibility {
  static readonly type = '[App] Set News Visibility';
  constructor(public visibility: NewsState) { }
}

export class MobileResolution {
  static readonly type = '[App] Set Mobile Resolution';
  constructor(public resolution: MobileResolutionState) { }
}
