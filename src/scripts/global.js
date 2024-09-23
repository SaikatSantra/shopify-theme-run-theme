// import initFilters from './sections/filters';
import { scrollToEls } from './global/scrollTo';
import headerInit from './sections/header/headerInit';
import { initAnnouncementBar } from './sections/header/announcementBar';
import cookieWarning from './dom/cookieWarning';
import { clickToggle } from './global/clickToggle';
import dismissablesInit from './components/dismissables';
// import initLoadMore from './sections/products/loadMore';
import initialiseZoom from './components/productZoom';
import { initSort } from './sections/products/sort';
import addToCartBtnInit from './sections/cart/addToCart';
// import lazyloadify from './global/lazyload';
import initLoadMore from './sections/products/loadMore';
import { ready, onShopifySectionLoad } from './global/instantiate';
import initAccordion from './components/accordion';
import { checkIfUserCanBeTracked, onConsentLoad, setTrackingConsent } from './dom/tracking';
import allowGTMTracking from './dom/allowGTMTracking';
import initLabelButtons from './global/labelButtons';
import animations from './dom/animations';
import initCopyUrl from './components/copyUrl';
import getHeaderHeight from './global/getHeaderHeight';
import { swipify, swipifyMob } from './dom/swipify';
import { initVideo } from './dom/initVideo';
import initAppHeight from './global/appHeight';
import initHeaderHeight from './global/headerHeight';
import { initGiftCard } from './template/gift-card';
import { nostoUrls, nostoSwatches, nostoAtc } from './global/nostoHelpers';
import initNewsletterPop from './components/newsletterPopup';
import initLowPowerMode from './global/lowPowerMode';
import { initGeo } from './global/geo';
import initHotspotsBanner from './sections/hotspotBanner';
import initQuantitySelector from './global/quantitySelector';
// This can be useful for third party forms such as Klaviyo where we don't have control over the markup
// import initInputDirectives from './global/inputDirective';
// This will get every link across the site and if it doesn't contain the correct market link
// it will update it. Useful for client input content but not a requirement for every project
// import hrefFix from './global/hrefFix';

// Helper functions
const defaultWindowBlubolt = {
  turboLinksActive: false,
  stickers: {},
  dom: {
    initialiseZoom,
    swipify,
    swipifyMob,
    nostoUrls,
    nostoSwatches,
    nostoAtc
    // initFilters,
  },
  consent: {
    checkIfUserCanBeTracked,
    setTrackingConsent
  }
};

// merge changes instead of overwriting
if (!window.blubolt) {
  window.blubolt = defaultWindowBlubolt;
} else {
  window.blubolt = { ...window.blubolt, ...defaultWindowBlubolt };
}

ready(() => {
  initLabelButtons();
  initAnnouncementBar();
  headerInit();
  animations();
  clickToggle();
  dismissablesInit();
  cookieWarning();
  swipify();
  swipifyMob();
  initSort();
  scrollToEls();
  addToCartBtnInit();
  initAccordion();
  initCopyUrl();
  getHeaderHeight();
  initVideo();
  initAppHeight();
  initHeaderHeight();
  initGiftCard();
  initNewsletterPop();
  initLowPowerMode();
  initGeo();
  initHotspotsBanner();
  initQuantitySelector();
  // hrefFix()
  initLoadMore(() => {
    console.info('Infinite scroll products loaded');
  });

  onConsentLoad(consent => {
    if (consent) {
      //any tracking can be set up here
      //this fires on page load if a user has already consented or at the moment of consent
      console.info('user allows tracking!');
      allowGTMTracking();
    }
  });
});

onShopifySectionLoad(() => {
  initAnnouncementBar();
  headerInit();
  animations();
  clickToggle();
  swipify();
  swipifyMob();
  initNewsletterPop();
  initLowPowerMode();
  initGeo();
  initHotspotsBanner();
  initQuantitySelector();

  if (!window['nostojs']) {
    return;
  }

  window['nostojs'](function (api) {
    api.loadRecommendations({});
  });

  window['nostojs'](function (api) {
    api.listen('postrender', function () {
      if (window['blubolt']) {
        window['blubolt'].dom.swipify();
        window['blubolt'].dom.nostoUrls();
        window['blubolt'].dom.nostoSwatches();
        window['blubolt'].dom.nostoAtc();
      }
    });
  });
});
