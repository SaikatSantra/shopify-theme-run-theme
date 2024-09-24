import { ActionReturnType } from './helpers';
import CONSTANTS from '../../_constants';

export const dispatchToast = (type: string, data: any, quantities?: any) => ({
  type: CONSTANTS.TOAST_DISPATCH,
  payload: { type, data, quantities },
}); //eslint-disable-line @typescript-eslint/explicit-module-boundary-types
export const showToast = (): ActionReturnType => ({
  type: CONSTANTS.TOAST_SHOW,
  payload: {},
});
export const hideToast = (): ActionReturnType => ({
  type: CONSTANTS.TOAST_HIDE,
  payload: {},
});
export const dismissToast = (): ActionReturnType => ({
  type: CONSTANTS.TOAST_DISMISS,
  payload: {},
});
