import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Traverser } from 'angular-traversal';
import { GrangeCore } from '@guillotinaweb/grange-core';
import { GrangeState } from './state/state';
import { PastanagaService } from '@guillotinaweb/pastanaga-angular';

@Injectable({
    providedIn: 'root'
})
export class Grange {

    constructor(
        public traverser: Traverser,
        public core: GrangeCore,
        public store: Store<GrangeState>,
        public ui: PastanagaService,
    ) {
        this.store.dispatch({ type: '[Traversing] Watch'});
    }
}
