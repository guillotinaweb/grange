import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GrangeStateFeatures, GrangeState, Link } from './state';

export const grangeSelector = createFeatureSelector<GrangeState>(
    GrangeStateFeatures.Grange
);

export const getBreadcrumbs = createSelector(
    grangeSelector,
    (state: GrangeState): Link[] => state.breadcrumbs
);
