import setZoom from "./setZoom";
import setUpPans from "./setUpPans";
import updateUrl from "./updateUrl";

const toggleZoom = (coords, state) => {
  if (!state.zoomFlag) {
    state = setZoom(coords, state.maxZoom, state);
    state = setUpPans(coords, state);
  } else {
    state = setZoom(coords, 1, state);
  }
  state = updateUrl(state);
  return state;
};

export default toggleZoom;
