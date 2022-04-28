import { actions } from './constants';
import { authState } from './state';

export function subjectReducer(state = authState, action) {
  switch (action.type) {
    case actions.SET_CURRENT_SUBJECT: {
      return {
        ...state,
        currentSubject: action.payload
      };
    }
    default:
      return state;
  }
}
