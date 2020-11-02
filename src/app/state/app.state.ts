import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppStateModel } from './app-state';
import { Images } from './app.actions';
import { Injectable } from '@angular/core';

const defaults: AppStateModel = {

    images: {
        headerImage: '',
        firstContentImage: '',
        secondContentImage: ''
    },
    newsVisibility: true

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
        return state.newsVisibility;
    }

    //// Actions

    @Action(Images)
    setImages(
        { patchState }: StateContext<AppStateModel>,
        { images }: Images) {
        patchState({ images });
    }

    @Action(Images)
    setImages(
        { patchState }: StateContext<AppStateModel>,
        { value }: boolean) {
        patchState({ value });
    }

}