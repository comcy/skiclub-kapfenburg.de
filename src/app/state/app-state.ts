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


export interface AppStateModel {
    images: AppImagesState;
    news: NewsState,
    resolution: MobileResolutionState
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
