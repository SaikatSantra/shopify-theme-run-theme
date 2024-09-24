function removeProtocol(path: string): string {
  return path.replace(/http(s)?:/, '');
}

/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */
const getSizedImageUrl = (
  src: string,
  size: string,
  crop = 'center',
): string => {
  if (!src) {
    const fallbackImgElem: HTMLImageElement = document.querySelector(
      '[data-img-fallback]',
    );
    return fallbackImgElem?.src;
  }

  if (size === null) {
    return src;
  }

  if (size === 'master') {
    return removeProtocol(src);
  }

  const match = src.match(
    /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|webp|pjpg)(\?.*)?$/i,
  );

  if (match) {
    const imageDimensions = size.split('x');
    const setWidth = `&width=${imageDimensions[0]}`;
    const setHeight = imageDimensions[1] ? `&height=${imageDimensions[1]}` : '';
    const setCrop =
      imageDimensions[0] === imageDimensions[1]
        ? '&crop=center'
        : `&crop=${crop}`;
    const setPrefix = src.split(match[0])[0];
    const setSuffix = match[0];

    return removeProtocol(
      `${setPrefix}${setSuffix}${setWidth}${setHeight}${setCrop}`,
    );
  } else {
    console.error(
      `Image format not supported: ${src.split('.')[3].split('?')[0]}`,
    );
    return null;
  }
};

const getCroppedCenterURL = (img: string, size: string): string => {
  const unCroppedURL = getSizedImageUrl(img, size);
  const n = unCroppedURL.lastIndexOf('.');
  if (n < 1) return '';
  const imgURL =
    unCroppedURL.substring(0, n) + '_crop_center' + unCroppedURL.substring(n);
  return imgURL;
};

export { getSizedImageUrl, getCroppedCenterURL };
