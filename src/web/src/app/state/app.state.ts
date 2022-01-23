/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppStateModel, MobileResolutionState, NewsState } from './app-state';
import { Images, MobileResolution, NewsVisibility } from './app.actions';
import { Injectable } from '@angular/core';

const defaults: AppStateModel = {

    images: {
        headerImage: '',
        firstContentImage: '',
        secondContentImage: ''
    },
    news: {
        visibility: false
    },
    resolution: {
        isMobileResolution: false
    }
};

@State<AppStateModel>({
    name: 'app',
    defaults
})
@Injectable()
export class AppState {

    //// Selectors

    @Selector()
    static getImages(state: AppStateModel) {
        return state.images;
    }

    @Selector()
    static getNewsVisibilityStatus(state: AppStateModel) {
        return state.news.visibility;
    }

    @Selector()
    static getMobileResolutionStatus(state: AppStateModel) {
        return state.resolution.isMobileResolution;
    }

    //// Actions

    @Action(Images)
    setImages(
        { patchState }: StateContext<AppStateModel>,
        { images }: Images) {
        patchState({ images });
    }

    @Action(NewsVisibility)
    setNewsVisibility(
        { patchState }: StateContext<AppStateModel>,
        { news }: NewsVisibility) {
        patchState({ news });

    }

    @Action(MobileResolution)
    setMobileResolution(
        { patchState }: StateContext<AppStateModel>,
        { resolution }: MobileResolution) {
        patchState({ resolution });
    }

}
