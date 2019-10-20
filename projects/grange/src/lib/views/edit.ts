import { Component, OnInit } from '@angular/core';
import { BaseView } from './base';
import { Grange } from '../grange.service';
import { concatMap, map, take } from 'rxjs/operators';
import { Toaster } from 'pastanaga-angular';

const FIELDS_EXCLUDE = [
    'type_name',
    'uuid',
    'creation_date',
    'modification_date',
    'history',
    'tiles',
    'tiles_layout',
];

@Component({
    selector: 'grange-edit-view',
    templateUrl: 'edit.html',
    styleUrls: ['./edit.scss'],
})
export class EditView extends BaseView implements OnInit {
    error?: string;
    schema?: any;
    editModel?: any;
    richTextFields: string[] = [];

    constructor(
        public grange: Grange,
        public toaster: Toaster,
    ) {
        super(grange);
    }

    ngOnInit() {
        this.context.pipe(
            concatMap(context => this.grange.core.resource.type(context['@type']).pipe(
                map(schema => [schema, context])
            ))
        ).subscribe(([schema, context]) => {
            // define main fieldset
            schema.fieldsets = [{
                id: 'fieldset-main',
                title: 'Default',
                fields: [],
            }];

            // move behavior fields in main schema
            schema = this.flattenSchema(schema);

            // filter and fix fields
            schema = this.processSchema(schema);

            // set main fieldset fields
            schema.fieldsets[0].fields = Object.keys(schema.properties)
                .filter(prop => prop.indexOf('.') === -1);

            this.editModel = this.flattenModel(JSON.parse(JSON.stringify(context)));
            this.schema = schema;
        });
    }

    processSchema(schema: any): any {
        if (!schema.properties) {
            return;
        }
        Object.keys(schema.properties).forEach(prop => {
            if (!schema.properties[prop] || prop.startsWith('__') || FIELDS_EXCLUDE.includes(prop) || schema.properties[prop].readonly) {
                delete schema.properties[prop];
                return;
            }
            if (schema.properties[prop].type === 'array' && !schema.properties[prop].items) {
                schema.properties[prop].widget = 'select';
                schema.properties[prop].items = {
                    type: 'string',
                    oneOf: []
                };
            }
            if (schema.properties[prop].type === 'datetime') {
                // FIX ME: add a datetime widget on our form lib
                schema.properties[prop].type = 'string';
            }
            if (schema.properties[prop].type === 'integer') {
                schema.properties[prop].type = 'string';
            }
            if (schema.properties[prop].widget && (
                schema.properties[prop].widget === 'richtext'
                || schema.properties[prop].widget.id === 'richtext')) {
                schema.properties[prop].type = 'string';
                this.richTextFields.push(prop);
                delete schema.properties[prop].fieldsets;
                delete schema.properties[prop].properties;
            }
        });
        return schema;
    }

    flattenSchema(schema: any): any {
        Object.keys(schema.definitions).forEach(behavior => {
            if (!schema.properties[behavior]) {
                return;
            }
            const behaviorSchema = this.processSchema(schema.definitions[behavior]);
            delete schema.properties[behavior];
            const fields: string[] = [];
            Object.keys(behaviorSchema.properties).forEach(field => {
                schema.properties[behavior + '.' + field] = schema.definitions[behavior].properties[field];
                fields.push(behavior + '.' + field);
            });
            if (fields.length > 0) {
                schema.fieldsets.push({
                    id: 'fieldset-' + behavior,
                    title: behaviorSchema.title,
                    fields,
                });
            }
        });
        return schema;
    }

    flattenModel(model: any): any {
        Object.keys(model).forEach(key => {
            if (key.includes('.')) {
                Object.keys(model[key]).forEach(subKey => {
                    const flatKey = key + '.' + subKey;
                    model[flatKey] = model[key][subKey];
                    if (this.richTextFields.includes(flatKey) && model[flatKey].data) {
                        model[flatKey] = model[flatKey].data;
                    }
                });
                delete model[key];
            }
        });
        return model;
    }

    updateModel(model: any, flatModel: any): any {
        Object.keys(flatModel).forEach(key => {
            if (this.richTextFields.includes(key)) {
                flatModel[key] = {
                    content_type: 'text/html',
                    encoding: 'utf-8',
                    data: flatModel[key],
                };
            }
            if (key.includes('.')) {
                const behavior = key.split('.').slice(0, -1).join('.');
                const subKey = key.split('.').slice(-1)[0];
                model[behavior][subKey] = flatModel[key];
            } else {
                model[key] = flatModel[key];
            }
        });

        return model;
    }

    onSave() {
        if (!this.error) {
            this.context.pipe(take(1)).subscribe(context => {
                const model = this.updateModel(context, this.editModel);
                this.grange.core.resource
                    .save(context['@id'], model)
                    .subscribe(
                        () => {
                            this.toaster.open('Updated');
                            this.grange.traverser.traverse('.');
                        },
                        () => this.toaster.open('Error when updating'),
                    );
            });
        }

    }

    onCancel() {
        this.grange.traverser.traverse('.');
    }
}
