import CONSTANTS from "../../util/constants";

export const toggleLoading = (bool) => ({
  type: CONSTANTS.LOADING,
  payload: !bool,
});
export const setLoading = (val) => ({ type: CONSTANTS.LOADING, payload: val });
