export interface AppStateModel {
    images: AppImages;
    newsVisibility: boolean;

}

export interface AppImages {
    headerImage: string;
    firstContentImage: string;
    secondContentImage: string;
}
