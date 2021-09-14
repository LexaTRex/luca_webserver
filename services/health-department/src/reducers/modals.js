// Actions
import { OPEN_MODAL, CLOSE_MODAL } from 'actions/modals';

const initialState = [];

export const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      state.push(action.payload);
      return [...state];
    case CLOSE_MODAL:
      state.pop();
      return [...state];
    default:
      return state;
  }
};
