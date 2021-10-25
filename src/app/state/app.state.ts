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
        visibility: true
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
        { visibility }: NewsState) {
        patchState({
            news: {
                visibility
            }
        });
    }

    @Action(MobileResolution)
    setMobileResolution(
        { patchState }: StateContext<AppStateModel>,
        { isMobileResolution }: MobileResolutionState) {
        patchState({
            resolution: {
                isMobileResolution
            }
        });
    }

}
