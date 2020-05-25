import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, switchMap, take, concatMap, filter, catchError, map } from 'rxjs/operators';
import { TraverserActions, TraverserSelectors } from '@guillotinaweb/ngx-state-traverser';
import { select, Store } from '@ngrx/store';
import { GrangeState } from './state';
import { GrangeCore } from '@guillotinaweb/grange-core';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class GrangeEffects {

    @Effect({dispatch: false})
    readonly onTraverse = this.actions.pipe(
        ofType(TraverserActions.Types.Traverse),
        tap(() => window.scrollTo(0, 0))
    );

    @Effect()
    updateResource = this.actions.pipe(
        ofType<TraverserActions.UpdateTraverserResource>(TraverserActions.Types.UpdateTraverserResource),
        switchMap(action => this.store.pipe(
            select(TraverserSelectors.getObjectByPath(action.payload.path)),
            take(1),
            filter(resource => !!resource['@id']),
            concatMap(resource => this.core.resource.update(resource['@id'], resource).pipe(
                map(() => EMPTY),
                // if error on update, we traverse the resource in order to put the backend version in our local state
                catchError(() => of(new TraverserActions.Traverse(this.core.api.getPath(resource['@id']))))
            )),
        )),
    );

    constructor(
        private readonly actions: Actions,
        private readonly store: Store<GrangeState>,
        private core: GrangeCore,
    ) {}
}
