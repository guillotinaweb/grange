import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Grange } from '../grange.service';
import { BaseComponent } from './base';
import { take } from 'rxjs/operators';

@Component({
    selector: 'grange-actions',
    templateUrl: 'actions.html',
    styleUrls: ['./actions.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent extends BaseComponent {

    constructor(public grange: Grange) {
        super(grange);
    }

    delete() {
        this.context.pipe(take(1)).subscribe(context => {
            if (confirm('Delete ' + context.title)) {
                const parent = context['@id'].split('/').slice(0, -1).join('/');
                this.grange.core.resource.delete(context['@id']).subscribe(() => {
                    this.grange.traverser.traverse(parent);
                });
            }
        });
    }
}
