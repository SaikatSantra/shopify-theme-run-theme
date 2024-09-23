import { Cart } from '../../util/typings';
import CONSTANTS from '../../_constants';
import { ActionReturnType } from './helpers';

export const setCartActive = (value: boolean): ActionReturnType => ({ type: CONSTANTS.CART_ACTIVE, payload: value });

export const getCartSuccess = (cartState: Cart | any): ActionReturnType => ({
  type: CONSTANTS.CART_UPDATE,
  payload: cartState
});
export const addToCartSuccess = (items: any[]): ActionReturnType => ({ type: CONSTANTS.CART_ADD, payload: items })
export const addToCartFail = (error: Error): ActionReturnType => ({ type: CONSTANTS.CART_FAIL, payload: error })
export const clearCartSuccess = (): ActionReturnType => ({ type: CONSTANTS.CART_CLEAR, payload: {} })
export const removeItemSuccess = (lineItem: any[]): ActionReturnType => ({ type: CONSTANTS.CART_REMOVEITEM, payload: lineItem })
export const setMinicart = (force: boolean): ActionReturnType => ({type: CONSTANTS.CART_OPEN_MINICART, payload: force})

export const setCartUpdating = (updating: boolean): ActionReturnType => ({type: CONSTANTS.CART_UPDATING, payload: updating})
