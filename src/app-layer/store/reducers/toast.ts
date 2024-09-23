import { produce } from "immer";
import CONSTANTS from "../../_constants";
import { ToastStateInterface, toastInitialState } from "../state/toast";

export default produce((draft: ToastStateInterface, action) => {
  switch (action.type) {
    case CONSTANTS.TOAST_DISPATCH:
      draft.active = true;
      draft.type = action.payload.type;
      draft.data = draft.data.concat(action.payload.data);
      if (action.payload.quantities) {
        draft.quantities = draft.quantities.concat(action.payload.quantities);
      }
      break;

    case CONSTANTS.TOAST_HIDE:
      draft.isShowing = false;
      break;

    case CONSTANTS.TOAST_SHOW:
      draft.isShowing = true;
      break;

    case CONSTANTS.TOAST_DISMISS:
      draft.active = false;
      draft.type = "";
      draft.data = [];
      draft.quantities = [];
      break;

    default:
      break;
  }

  return draft;
}, toastInitialState);
