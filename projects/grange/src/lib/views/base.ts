import { OnDestroy } from '@angular/core';
import { select } from '@ngrx/store';
import { TraverserSelectors } from 'ngx-state-traverser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Grange } from '../grange.service';
import { Resource } from 'grange-core';

export class BaseView implements OnDestroy {
    destroy = new Subject();
    context = TraverserSelectors.TraverserContext<Resource>(this.grange.store).pipe(takeUntil(this.destroy));
    contextPath = this.grange.store.pipe(
        takeUntil(this.destroy),
        select(TraverserSelectors.getContextPath)
    );
    parentPath = this.grange.store.pipe(
        takeUntil(this.destroy),
        select(TraverserSelectors.getParentPath)
    );
    isForbidden = this.grange.store.pipe(
        takeUntil(this.destroy),
        select(TraverserSelectors.isForbidden)
    );

    constructor(
        public grange: Grange,
    ) {
        this.isForbidden.subscribe(isForbidden => {
            if (isForbidden) {
                this.grange.traverser.traverse('./@@login');
            }
        });
        this.grange.core.auth.isAuthenticated.pipe(takeUntil(this.destroy)).subscribe(auth => {
            if (!auth.state) {
                this.grange.traverser.traverse('./@@login');
            }
        });
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }
}
