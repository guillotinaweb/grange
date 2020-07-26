import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Traverser } from 'angular-traversal';
import { GrangeCore } from '@guillotinaweb/grange-core';
import { GrangeState } from './state/state';
import { PastanagaService } from '@guillotinaweb/pastanaga-angular';
import { Observable, AsyncSubject } from 'rxjs';
import { TraverserSelectors, TraverserActions, deepMerge } from '@guillotinaweb/ngx-state-traverser';
import { take, concatMap, tap, skip, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class Grange {
    constructor(
        public traverser: Traverser,
        public core: GrangeCore,
        public store: Store<GrangeState>,
        public ui: PastanagaService,
    ) {
        this.store.dispatch({ type: '[Traversal] Watch' });
    }

    getContext(): Observable<any> {
        return this.store.pipe(select(TraverserSelectors.getContext));
    }

    getContextAs<T>(): Observable<T> {
        return this.getContext().pipe(map((context) => context as T));
    }

    updateContext(changes: any): { onComplete: Observable<boolean> } {
        const onComplete = new AsyncSubject<boolean>();
        let initialContext: any;
        let path: string;
        this.getContext()
            .pipe(
                take(1),
                tap((context) => {
                    initialContext = context;
                    path = this.core.api.getPath(context['@id']);
                    this.store.dispatch(new TraverserActions.UpdateTraverserResource({ path, changes }));
                }),
                concatMap((newContext) => this.core.resource.update(path, deepMerge(initialContext, changes))),
            )
            .subscribe(
                () => {
                    onComplete.next(true);
                    onComplete.complete();
                },
                () => {
                    this.store.dispatch(
                        new TraverserActions.UpdateTraverserResource({ path, changes: initialContext }),
                    );
                    onComplete.next(false);
                    onComplete.complete();
                },
            );
        return { onComplete };
    }

    addInContext(content: any): { onComplete: Observable<boolean> } {
        const onComplete = new AsyncSubject<boolean>();
        this.getContext()
            .pipe(
                take(1),
                concatMap((context) => this.core.resource.create(context['@id'], content)),
            )
            .subscribe(
                () => {
                    onComplete.next(true);
                    onComplete.complete();
                },
                () => {
                    onComplete.next(false);
                    onComplete.complete();
                },
            );
        return { onComplete };
    }

    deleteContext(): { onComplete: Observable<boolean> } {
        const onComplete = new AsyncSubject<boolean>();
        let initialContext: any;
        let path: string;
        this.getContext()
            .pipe(
                take(1),
                tap((context) => {
                    initialContext = context;
                    path = this.core.api.getPath(context['@id']);
                    this.store.dispatch(new TraverserActions.CleanTraverserResources([path]));
                }),
                concatMap(() => this.core.resource.delete(path)),
            )
            .subscribe(
                () => {
                    onComplete.next(true);
                    onComplete.complete();
                },
                () => {
                    this.store.dispatch(
                        new TraverserActions.UpdateTraverserResource({ path, changes: initialContext }),
                    );
                    onComplete.next(false);
                    onComplete.complete();
                },
            );
        return { onComplete };
    }
}
