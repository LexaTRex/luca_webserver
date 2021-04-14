// Actions
import { OPEN_MODAL, CLOSE_MODAL } from 'actions/modals';

const initialState = null;

export const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return action.payload;
    case CLOSE_MODAL:
      return null;
    default:
      return state;
  }
};
