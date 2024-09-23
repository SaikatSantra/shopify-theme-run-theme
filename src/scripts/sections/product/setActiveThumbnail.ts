const setActiveThumbnail = (
  thumbnails: NodeListOf<Element>,
  thumbailDataAttr: string,
  activeClass: string,
  position: number,
): void => {
  thumbnails.forEach((thumbnail) => {
    if (parseInt(thumbnail.getAttribute(thumbailDataAttr)) === position) {
      thumbnail.classList.add(activeClass);
    } else {
      thumbnail.classList.remove(activeClass);
    }
  });
};

export default setActiveThumbnail;
