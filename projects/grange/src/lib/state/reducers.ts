import { initialState, GrangeState } from './state';
import { Action, ActionTypes } from './actions';

export function reducer(state = initialState, action: Action): GrangeState {
    switch (action.type) {
        case ActionTypes.SetBreadcrumbs: {
            return {
                ...state,
                breadcrumbs: action.payload,
            };
        }
        default: {
            return state;
        }
    }
}
