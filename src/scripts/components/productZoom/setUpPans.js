const setUpPans = (coords, state) => {
  state.transformOrigin.x = coords.x;
  state.transformOrigin.y = coords.y;
  state.dragActive = false;
  state.current.x = state.containerCentre.x;
  state.current.y = state.containerCentre.y;
  state.initial.x = state.containerCentre.x;
  state.initial.y = state.containerCentre.y;
  state.offset.x = 0;
  state.offset.y = 0;
  return state;
};
export default setUpPans;
