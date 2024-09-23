import initialState from '../state/cart';
import { produce } from 'immer';
import CONSTANTS from '../../_constants';

export default produce((draft, action) => {
  switch (action.type) {

    case CONSTANTS.CART_ACTIVE:
      draft.cartActive = action.payload;
      return draft;

    case CONSTANTS.CART_UPDATE:
      draft.current = action.payload;
      return draft;
    
    case CONSTANTS.CART_OPEN_MINICART:
      draft.minicartOpen = action.payload;
      return draft;
  
    case CONSTANTS.CART_UPDATING:
      draft.updating = action.payload;
      return draft;

    case CONSTANTS.CART_ADD:
      draft.lastAdded = action.payload;
      return draft;

    case CONSTANTS.CART_FAIL:
    case CONSTANTS.CART_REMOVEITEM:
    case CONSTANTS.CART_CLEAR:
    default:
      return draft;
  }
}, initialState);