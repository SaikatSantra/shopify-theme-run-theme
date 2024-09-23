const setZoom = (coords, level, state) => {
  if (level !== state.zoomLevel) {
    state.el.addEventListener("transitionend", function () {
      state.el.dataset.zooming = "false";
    });
    state.el.dataset.zooming = state.zoomFlag ? "out" : "in";
  }
  state.zoomLevel = Math.min(Math.max(level, 1), state.maxZoom);
  state.zoomFlag = state.zoomLevel > 1;
  state.el.style.transform = "scale(" + state.zoomLevel + ")";
  state.el.style.transformOrigin = "" + coords.x + "px " + coords.y + "px";
  state.el.dataset.zoomed = state.zoomFlag ? "true" : "false";
  return state;
};

export default setZoom;
