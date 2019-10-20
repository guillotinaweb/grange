import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Grange } from '../grange.service';
import { BaseComponent } from './base';
import { TraverserSelectors } from 'ngx-state-traverser';

@Component({
    selector: 'grange-breadcrumbs',
    templateUrl: 'breadcrumbs.html',
    styleUrls: ['./breadcrumbs.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent extends BaseComponent {

    ancestors = TraverserSelectors.TraverseToAncestors(this.grange.store, '.');

    constructor(public grange: Grange) {
        super(grange);
    }
}
