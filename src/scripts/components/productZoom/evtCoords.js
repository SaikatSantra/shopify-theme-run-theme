
const evtCoords = (e) => {
  const coords = {};
  if (e.touches) {
    coords.x = e.touches[0].clientX;
    coords.y = e.touches[0].clientY;
  } else {
    coords.x = e.clientX;
    coords.y = e.clientY;
  }
  return coords;
}

export default evtCoords;