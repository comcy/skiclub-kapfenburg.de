import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppStateModel, NewsState } from './app-state';
import { Images, NewsVisibility } from './app.actions';
import { Injectable } from '@angular/core';

const defaults: AppStateModel = {

    images: {
        headerImage: '',
        firstContentImage: '',
        secondContentImage: ''
    },
    news: {
        visibility: true
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

}