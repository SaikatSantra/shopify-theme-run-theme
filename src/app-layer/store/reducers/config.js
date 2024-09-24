import configState from '../state/config';
import produce from 'immer';

export default produce((draftState, action) => {
  switch (action.type) {
    default:
      return draftState;
  }
}, configState);
