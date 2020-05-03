import { NgModule } from '@angular/core';
import { store } from './store';
import { EffectsModule } from '@ngrx/effects';
import { GrangeEffects } from './effects';


@NgModule({
    imports: [
        // ...store,
        EffectsModule.forRoot([GrangeEffects]),
    ]
})
export class GrangeStateModule {
}
