export interface AppStateModel {
    images: AppImagesState;
    news: NewsState
}

export interface AppImagesState {
    headerImage: string;
    firstContentImage: string;
    secondContentImage: string;
}

export interface NewsState {
    visibility: boolean;
}
