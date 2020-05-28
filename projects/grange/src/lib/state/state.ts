export interface Link {
    path: string;
    title: string;
}

export enum GrangeStateFeatures {
    Grange = 'grange',
}

export interface GrangeState {
    breadcrumbs: Link[];
}

export const initialState: GrangeState = {
    breadcrumbs: [],
};
