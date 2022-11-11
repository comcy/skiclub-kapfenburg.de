/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
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
