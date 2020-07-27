import { OnDestroy, Directive } from "@angular/core";
import { select } from "@ngrx/store";
import { TraverserSelectors } from "@guillotinaweb/ngx-state-traverser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Grange } from "../grange.service";
import { Resource } from "@guillotinaweb/grange-core";

@Directive()
export class BaseComponent implements OnDestroy {
  destroy = new Subject();
  context = TraverserSelectors.TraverserContext<Resource>(
    this.grange.store
  ).pipe(takeUntil(this.destroy));
  contextPath = this.grange.store.pipe(
    takeUntil(this.destroy),
    select(TraverserSelectors.getContextPath)
  );
  parentPath = this.grange.store.pipe(
    takeUntil(this.destroy),
    select(TraverserSelectors.getParentPath)
  );

  constructor(public grange: Grange) {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
