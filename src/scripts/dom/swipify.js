import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  FreeMode,
  Thumbs,
  Autoplay,
  Zoom,
} from "swiper/modules";
import { throttle } from "throttle-debounce";
import safeJSONParse from "../utils/safeJsonParse";

const MOBILE_BREAKPOINT = 1024;

/**
 * Standard Swiper instantiation
 */
export const swipify = () => {
  const swipers = document.querySelectorAll("[data-swiper]");
  const thumbSwipers = [];

  if (!swipers.length) return;

  window.blubolt.swiperObjects = [];

  swipers.forEach((swiper) => {
    const slides = swiper.querySelectorAll(".swiper-slide");
    let config = swiper.dataset.swiperConfig
      ? safeJSONParse(swiper.dataset.swiperConfig, false)
      : {};
    const mods = [];
    !config ? console.error("Error in Swiper JSON") : null;
    if (slides.length && config) {
      // The way Swiper works is that it loads 'modules'
      // Here we're looking for a reference to the module in the config
      // If it's there we add it to the mods array
      if ("navigation" in config) {
        mods.push(Navigation);
      }
      if ("pagination" in config) {
        mods.push(Pagination);
      }
      if ("freeMode" in config) {
        mods.push(FreeMode);
      }
      if ("autoplay" in config) {
        mods.push(Autoplay);
      }
      if ("thumbs" in config) {
        mods.push(Thumbs);
        thumbSwipers.forEach((thumbSwiper) => {
          config = { ...config, ...{ thumbs: { swiper: thumbSwiper } } };
        });
      }
      if ("zoom" in config) {
        mods.push(Zoom);
      }

      // We then add the modules to the config
      config = { ...config, ...{ modules: mods } };

      swiper.classList.add("swiper--active");
      const newSwiper = new Swiper(swiper, config);
      // If the swiper is for thumbs we push it to the thumbSwipers array
      if (swiper.dataset.swiperThumbs) {
        thumbSwipers.push(newSwiper);
      }

      window.blubolt.swiperObjects.push(newSwiper);
    }
  });
};

/**
 * Instantiate swipers for mobile only
 */
export const swipifyMob = () => {
  const swipers = document.querySelectorAll("[data-swiper-mob]");

  if (!swipers.length) return;

  window.blubolt.swiperMobileObjects = [];

  const initSwiperOnMobile = () => {
    // TODO: Swap less than
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      swipers.forEach((swiper) => {
        const slides = swiper.querySelectorAll(".swiper-slide");
        let config = swiper.dataset.swiperConfig
          ? safeJSONParse(swiper.dataset.swiperConfig, false)
          : {};
        const mods = [];
        !config ? console.error("Error in Swiper JSON") : null;
        if (slides.length && config) {
          if ("navigation" in config) {
            mods.push(Navigation);
          }
          if ("pagination" in config) {
            mods.push(Pagination);
          }
          if ("freeMode" in config) {
            mods.push(FreeMode);
          }
          if ("thumbs" in config) {
            mods.push(Thumbs);
          }
          if ("zoom" in config) {
            mods.push(Zoom);
          }

          config = { ...config, ...{ modules: mods } };
          swiper.classList.add("swiper--mob-active");
          const newSwiper = new Swiper(swiper, config);
          window.blubolt.swiperMobileObjects.push(newSwiper);
        }
      });
    } else {
      if (window.blubolt.swiperMobileObjects) {
        window.blubolt.swiperMobileObjects.forEach((swiper) => {
          swiper.destroy();
        });
        const keys = Object.keys(window.blubolt.swiperMobileObjects);
        keys.forEach((key) =>
          window.blubolt.swiperMobileObjects[key].destroy(),
        );
        window.blubolt.swiperMobileObjects = [];
      }
    }
  };

  initSwiperOnMobile();
  window.addEventListener(
    "resize",
    throttle(500, false, () => initSwiperOnMobile()),
  );
};

export default swipify;
