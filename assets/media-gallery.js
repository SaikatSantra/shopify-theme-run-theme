if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        liveRegion: this.querySelector('[id^="GalleryStatus"]'),
        viewer: this.querySelector('[id^="GalleryViewer"]'),
        thumbnails: this.querySelector('[id^="GalleryThumbnails"]')
      }
      this.mql = window.matchMedia('(min-width: 2048px)');
      if (!this.elements.thumbnails) return;
      this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 1));      
      this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
        // console.log(mediaToSwitch.querySelector('button'));
        mediaToSwitch.querySelector('button').addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
        // mediaToSwitch.querySelector('button').addEventListener('click',this.onSlideChanged(e));
      });
      if (this.dataset.desktopLayout !== 'stacked') this.removeListSemantic();
    }

    onSlideChanged(event) {
      // console.log(event)
      // console.log(this)
      var media__id = '';
      if(event.detail.currentElement != undefined){
         media__id = event.detail.currentElement.dataset.mediaId ;
      }else{
         media__id = this.querySelector(".mainSlider-image .slider__slide.is-active").dataset.mediaId ;
      }
      // console.log(this.elements.thumbnails.querySelector(`[data-target="${ media__id }"]`));
      const thumbnail = this.elements.thumbnails.querySelector(`[data-target="${ media__id }"]`);
      // console.log(thumbnail);
      const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${ media__id }"]`);
      this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
        element.classList.remove('is-active');
      });
      activeMedia.classList.add('is-active');
      this.setActiveThumbnail(thumbnail);
      // console.log( `
      //   ${media__id}
      //   `)
      // this.setActiveMedia(media__id, false);
    }

    setActiveMedia(mediaId, prepend) {
      // console.log(this)
      console.log( `
        ${mediaId}
        ${prepend}
        `)
      const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${ mediaId }"]`);
      this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
        element.classList.remove('is-active');
      });
      activeMedia.classList.add('is-active');

      if (prepend) {
        activeMedia.parentElement.prepend(activeMedia);
        if (this.elements.thumbnails) {
          const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
          activeThumbnail.parentElement.prepend(activeThumbnail);
        }
        if (this.elements.viewer.slider) this.elements.viewer.resetPages();
      }

      this.preventStickyHeader();
      window.setTimeout(() => {
        if (this.elements.thumbnails) {
          activeMedia.parentElement.scrollTo({ top: activeMedia.offsetTop });
          activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft });
        }
        
        if (!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked') {
          console.log(`!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked'`)
          activeMedia.scrollIntoView({behavior: 'smooth'});
        }
      });
      this.playActiveMedia(activeMedia);
      if (!this.elements.thumbnails) return;
      const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
      this.setActiveThumbnail(activeThumbnail);
      this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
    }

    setActiveThumbnail(thumbnail) {
      if (!this.elements.thumbnails || !thumbnail) return;
      this.elements.thumbnails.querySelectorAll('button').forEach((element) => element.removeAttribute('aria-current'));
      thumbnail.querySelector('button').setAttribute('aria-current', true);
      if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;
      this.elements.thumbnails.slider.scrollTo({ top: thumbnail.offsetTop });
    }

    announceLiveRegion(activeItem, position) {
      const image = activeItem.querySelector('.product__modal-opener--image img');
      // console.log(image);
      // console.log(position);
      if (!image) return;
      image.onload = () => {
        this.elements.liveRegion.setAttribute('aria-hidden', false);
        this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace('[index]', position);
        setTimeout(() => {
          this.elements.liveRegion.setAttribute('aria-hidden', true);
        }, 2000);
      };
      image.src = image.src;
    }

    playActiveMedia(activeItem) {
      window.pauseAllMedia();
      const deferredMedia = activeItem.querySelector('.deferred-media');
      if (deferredMedia) deferredMedia.loadContent(false);
    }

    preventStickyHeader() {
      this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
      if (!this.stickyHeader) return;
      this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
    }

    removeListSemantic() {
      if (!this.elements.viewer.slider) return;
      this.elements.viewer.slider.setAttribute('role', 'presentation');
      this.elements.viewer.sliderItems.forEach(slide => slide.setAttribute('role', 'presentation'));
    }
  });
}
