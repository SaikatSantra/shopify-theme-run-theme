
const movePan = (coords, state) => {
  state.dragBounds = {
    xMax: state.transformOrigin.x * (state.zoomLevel - 1),
    xMin: (state.container.offsetWidth - state.transformOrigin.x) * (1 - state.zoomLevel),
    yMax: state.transformOrigin.y * (state.zoomLevel - 1),
    yMin: (state.container.offsetHeight - state.transformOrigin.y) * (1 - state.zoomLevel)
  }
  state.current.x = Math.max(state.dragBounds.xMin, Math.min(coords.x, state.dragBounds.xMax));
  state.current.y = Math.max(state.dragBounds.yMin, Math.min(coords.y, state.dragBounds.yMax));
  state.offset.x = state.current.x;
  state.offset.y = state.current.y;
  return state;
}

export default movePan;