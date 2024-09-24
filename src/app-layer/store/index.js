import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers/index';
import initialState from './state/initialState';
import merge from '@ramda/merge';

const enhancers = [];
const enableTools = false;

if (process.env.NODE_ENV === 'development' || enableTools) {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }
}

const composedEnhancers = compose(...enhancers, applyMiddleware(thunk));

export default function configureStore(config) {
  const initialBuiltState = merge(initialState, config);

  return createStore(rootReducer, initialBuiltState, composedEnhancers);
}
