import { Action } from '@ngrx/store';
import { Link } from './state';

export enum ActionTypes {
    SetBreadcrumbs = '[Grange] Set breadcrumbs',
}

export class SetBreadcrumbs implements Action {
    readonly type = ActionTypes.SetBreadcrumbs;
    constructor(readonly payload: Link[]) {}
}

export type Action =
    | SetBreadcrumbs;
