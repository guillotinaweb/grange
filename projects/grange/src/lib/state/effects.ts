import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { TraverserActions } from '@guillotinaweb/ngx-state-traverser';
import { Store } from '@ngrx/store';
import { GrangeState } from './state';
import { GrangeCore } from '@guillotinaweb/grange-core';

@Injectable()
export class GrangeEffects {

    @Effect({dispatch: false})
    readonly onTraverse = this.actions.pipe(
        ofType(TraverserActions.Types.Traverse),
        tap(() => window.scrollTo(0, 0))
    );

    constructor(
        private readonly actions: Actions,
        private readonly store: Store<GrangeState>,
        private core: GrangeCore,
    ) {}
}
