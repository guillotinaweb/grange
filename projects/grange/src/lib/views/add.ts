import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BaseView } from './base';
import { Grange } from '../grange.service';
import { concatMap } from 'rxjs/operators';

@Component({
    selector: 'grange-add-view',
    templateUrl: 'add.html',
})
export class AddView extends BaseView implements OnInit {
    type = '';
    types: string[] = [];
    error?: string;

    constructor(public grange: Grange) {
        super(grange);
    }

    ngOnInit() {
        const httpParams = new HttpParams({fromString: window.location.href.split('?')[1] || ''});
        this.type = httpParams.get('type');
        if (!this.type) {
            this.contextPath.pipe(
                concatMap(path => this.grange.core.resource.addableTypes(path))
            ).subscribe(types => this.types = types);
        }
    }

    onSave(model: any) {
        this.error = '';
        model['@type'] = this.type;
        this.contextPath.pipe(concatMap(path => this.grange.core.resource.create(path, model))).subscribe(
            (res: any) => this.grange.traverser.traverse(res['@id']),
            error => this.error = error.message || `Something went wrong while creating ${model.id}`
        );
    }

    onCancel() {
        this.grange.traverser.traverse('.');
    }
}
