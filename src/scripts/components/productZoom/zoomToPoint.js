const zoomToPoint = (coords, state) => {
  state.el.addEventListener("transitionend", function () {
    state.el.dataset.zooming = "false";
  });
  state.el.dataset.zooming = state.zoomFlag ? "in" : "out";
  state.el.style.transform = "scale(" + state.zoomLevel + ")";
  state.el.style.transformOrigin = "" + coords.x + "px " + coords.y + "px";
  return state;
};
export default zoomToPoint;
