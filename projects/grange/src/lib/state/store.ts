import { StoreModule } from '@ngrx/store';
import { ModuleWithProviders } from '@angular/core';
import { reducer } from './reducers';
import { GrangeStateFeatures } from './state';

export const store: ModuleWithProviders[] = [
    StoreModule.forFeature(GrangeStateFeatures.Grange, reducer)
];
