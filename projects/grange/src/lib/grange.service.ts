import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Traverser } from 'angular-traversal';
import { GrangeCore } from '@guillotinaweb/grange-core';
import { GrangeState } from './state/state';
import { PastanagaService } from '@guillotinaweb/pastanaga-angular';
import { Observable } from 'rxjs';
import { TraverserSelectors, TraverserActions } from '@guillotinaweb/ngx-state-traverser';
import { take } from 'rxjs/operators';

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

    getContext(): Observable<any> {
        return this.store.pipe(select(TraverserSelectors.getContext));
    }

    updateContext(changes: any) {
        this.getContext().pipe(
            take(1)
        ).subscribe(context => this.store.dispatch(new TraverserActions.UpdateTraverserResource({
            path: this.core.api.getPath(context['@id']),
            changes
        })));
    }
}
