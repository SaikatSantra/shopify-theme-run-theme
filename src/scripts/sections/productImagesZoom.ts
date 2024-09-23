const VIEW_ZOOM_IMAGES_BREAKPOINT = 768;

export const initClickToViewGallery = (): void => {
  const images = document.querySelectorAll('[data-image-zoom-toggle]');
  if (images.length <= 0) return;

  images.forEach((img) => {
    img.addEventListener('click', () => {
      if (window.innerWidth > VIEW_ZOOM_IMAGES_BREAKPOINT) {
        window['blubolt'].selectZoomImage(img.getAttribute('data-image-index'));
        const bodyElem = document.querySelector('body');
        bodyElem.classList.add('modal-visible', 'modal-product-image-zoom', 'modal-open');
        document.querySelector('html').classList.add('modal-open');
      }
    })
  });
}
