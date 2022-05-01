import { actions } from './constants';

export const setCurrentSubject = (payload) => {
  return {
    type: actions.SET_CURRENT_SUBJECT,
    payload
  };
};

export const openDialog = (payload) => {
  return {
    type: actions.OPEN_DIALOG,
    payload
  };
};
