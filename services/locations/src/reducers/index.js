import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// Reducers
import { modalsReducer } from './modals';

export const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    modal: modalsReducer,
  });
