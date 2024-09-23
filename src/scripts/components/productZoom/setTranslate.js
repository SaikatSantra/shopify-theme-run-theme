const setTranslate = (state) => {
  state.el.style.transform =
    "translate3d(" +
    state.current.x +
    "px, " +
    state.current.y +
    "px, 0) scale(" +
    state.zoomLevel +
    ")";
  return state;
};
export default setTranslate;
