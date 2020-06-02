import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseView } from './base';
import { Grange } from '../grange.service';
import { concatMap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resource } from '@guillotinaweb/grange-core';

@Component({
    selector: 'grange-folder-view',
    templateUrl: 'folder.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FolderView extends BaseView {
    children: Observable<Resource[]>;

    constructor(public grange: Grange) {
        super(grange);
        this.refreshChildren();
    }

    refreshChildren() {
        this.children = this.contextPath.pipe(
            take(1),
            concatMap(path => this.grange.core.resource.items(path)),
            map(res => res.items)
        );
    }
}
