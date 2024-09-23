const startPan = (coords, onImage, state) => {
  clearTimeout(state.dragTimer);
  state.initial.x = coords.x - state.offset.x;
  state.initial.y = coords.y - state.offset.y;
  if (onImage) {
    state.dragActive = true;
    state.dragTimer = setTimeout(function () {
      state.container.dataset.dragging = true;
    }, 120);
  }
  return state;
}
export default startPan;