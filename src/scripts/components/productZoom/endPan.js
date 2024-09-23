const endPan = (state) => {
  clearTimeout(state.dragTimer);
  state.initial.x = state.current.x;
  state.initial.y = state.current.y;
  state.dragActive = false;
  state.container.dataset.dragging = false;
  return state;
};

export default endPan;
