import setZoom from './productZoom/setZoom';
import setUpPans from './productZoom/setUpPans';
import setTranslate from './productZoom/setTranslate';
import returnInitialZoomState from './productZoom/returnInitialZoomState';
import evtCoords from './productZoom/evtCoords';
import toggleZoom from './productZoom/toggleZoom';
import endPan from './productZoom/endPan';
import startPan from './productZoom/startPan';
import movePan from './productZoom/movePan';
import updateUrl from './productZoom/updateUrl';


const initialiseZoom = (wrapperSelector, level) => {

  //check we have container:
  const container = document.querySelector(wrapperSelector);
  if (!container) {
    return false;
  }



  container.style.overflow = 'hidden';

  //initalise the state:
  let zoomImageState = returnInitialZoomState(container, level);


  //if you click off of the zoom, we reset it.

  document.body.addEventListener('click', (evt) => {
    let el = evt.target;
    let clickedOff = true;
    while (el.parentNode) {
      if (el === container) {
        clickedOff = false;
        break;
      }
      el = el.parentNode;
    }
    if (clickedOff && zoomImageState.zoomFlag) {
      zoomImageState = setZoom(zoomImageState.containerCentre, 1, zoomImageState);
    }
  })

  //stop automatically picking up and dragging the image when mousedown
  zoomImageState.el.addEventListener('mousedown', (e) => {
    if (zoomImageState.zoomFlag) {
      e.preventDefault()
    }
  });

  //click to zoom event, toggle to coords of click
  zoomImageState.el.addEventListener('click', (e) => {
    zoomImageState = toggleZoom({
      x: e.offsetX,
      y: e.offsetY
    }, zoomImageState)
  });


  //pinch to zoom event, set the zoom to the scale of the event (how much pinched)
  zoomImageState.el.addEventListener('gesturechange', (e) => {
    e.preventDefault();
    zoomImageState = setZoom(zoomImageState.containerCentre, e.scale, zoomImageState);
  });

  //enf of pinch event, zoom to amount pinched or 1 (if zooming out), upate url
  zoomImageState.el.addEventListener('gestureend', (e) => {
    e.preventDefault();
    zoomImageState = setZoom(zoomImageState.containerCentre, Math.max(e.scale, 1), zoomImageState);
    zoomImageState = e.scale > 1 ? setUpPans(zoomImageState.containerCentre, zoomImageState) : zoomImageState;
    zoomImageState = updateUrl(zoomImageState);
  });



  //start of drag, start the panning (in zoomed in!)
  ['touchstart', 'mousedown'].forEach((evt) => {

    container.addEventListener(evt, e => {
      if (!zoomImageState.zoomFlag) {
        return false;
      }
      zoomImageState = startPan(evtCoords(e), (e.target === zoomImageState.el), zoomImageState);
    });
  });

  //move during the pan, if we are currently panning
  ['touchmove', 'mousemove'].forEach((evt) => {
    container.addEventListener(evt, e => {
      if (!zoomImageState.dragActive || !zoomImageState.zoomFlag) {
        return false
      }
      e.preventDefault();
      e.stopPropagation();

      zoomImageState = movePan({
        x: evtCoords(e).x - zoomImageState.initial.x,
        y: evtCoords(e).y - zoomImageState.initial.y
      }, zoomImageState);
      zoomImageState = setTranslate(zoomImageState);
    }, false, { passive: true });
  });


  //end of drag, stop the panning
  ['touchend', 'mouseup'].forEach((evt) => {
    container.addEventListener(evt, () => {
      zoomImageState = endPan(zoomImageState);
    }, false, { passive: true });
  });

  //create the toggle:
  const zoomToggle = document.createElement('DIV');
  zoomToggle.classList.add('zoom-toggle');

  //zoom toggle, toggle between max level and 1
  zoomToggle.addEventListener('click', () => {
    zoomImageState = setZoom(zoomImageState.containerCentre, zoomImageState.zoomFlag ? 1 : zoomImageState.maxZoom, zoomImageState);
    zoomImageState = updateUrl(zoomImageState);
  });

  //append the toggle
  container.appendChild(zoomToggle);

  //reset after resize...
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      zoomImageState = returnInitialZoomState(container, level);
    }, 300);
  });

  //add ready class
  container.classList.add('zoomy-initialised');


}

export default initialiseZoom;