import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseView } from './base';
import { Grange } from '../grange.service';

@Component({
    selector: 'grange-view-view',
    templateUrl: 'view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ViewView extends BaseView {
    constructor(public grange: Grange) {
        super(grange);
    }
}
