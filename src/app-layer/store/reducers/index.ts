import { combineReducers } from '../../util/redux-immer';
// import { combineReducers } from 'redux-immer/src/redux-immer';
import produce from 'immer';
import loading from './loading';
import config from './config';
import cart from './cart';
import toast from './toast';

export const rootReducer = combineReducers(produce, {
  config,
  loading,
  cart,
  toast
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>