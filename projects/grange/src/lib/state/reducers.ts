import { initialState, GrangeState } from './state';
import { GrangeAction, ActionTypes } from './actions';

export function reducer(state = initialState, action: GrangeAction): GrangeState {
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
