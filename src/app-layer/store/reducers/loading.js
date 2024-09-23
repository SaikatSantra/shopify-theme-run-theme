import initialState from '../state/loading';
import produce from 'immer';
import CONSTANTS from '../../_constants';

export default produce((draft, action) => {
  switch (action.type) {
    case CONSTANTS.LOADING:
      return draft = action.payload;
    default:
      return draft
  }
}, initialState);