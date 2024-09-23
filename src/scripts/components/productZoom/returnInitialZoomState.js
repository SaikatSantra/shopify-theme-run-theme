import setZoom from "./setZoom";
const returnInitialZoomState = (container, maxZoom) => {
  const el = container.querySelector("[data-main-product-image]");
  const containerCentre = {
    x: container.offsetWidth / 2,
    y: container.offsetHeight / 2,
  };
  const state = {
    container: container,
    el,
    containerCentre,
    zoomFlag: false,
    zoomLevel: 1,
    maxZoom,
    dragActive: false,
    transformOrigin: {
      x: containerCentre.x,
      y: containerCentre.y,
    },
    current: {
      x: containerCentre.x,
      y: containerCentre.y,
    },
    initial: {
      x: containerCentre.x,
      y: containerCentre.y,
    },
    offset: {
      x: 0,
      y: 0,
    },
    dragTimer: null,
    dragBounds: {
      xMax: 0,
      xMin: 0,
      yMax: 0,
      yMin: 0,
    },
  };
  return setZoom(containerCentre, 1, state);
};

export default returnInitialZoomState;
