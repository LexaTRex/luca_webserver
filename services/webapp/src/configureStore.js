import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createRootReducer } from './reducers';
import { IS_DEV } from './constants/environment';

export const configureStore = (preloadedState, history) => {
  const middlewares = [thunkMiddleware, routerMiddleware(history)];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  /* istanbul ignore next */
  const composedEnhancers = IS_DEV
    ? composeWithDevTools(...enhancers)
    : compose(...enhancers);

  return createStore(
    createRootReducer(history),
    preloadedState,
    composedEnhancers
  );
};
