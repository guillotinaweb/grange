import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseView } from './base';
import { Grange } from '../grange.service';
import { concatMap, map, take } from 'rxjs/operators';

@Component({
    selector: 'grange-folder-view',
    templateUrl: 'folder.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FolderView extends BaseView {
    children = this.contextPath.pipe(
        take(1),
        concatMap(path => this.grange.core.resource.items(path)),
        map(res => res.items)
    );

    constructor(public grange: Grange) {
        super(grange);
    }
}
