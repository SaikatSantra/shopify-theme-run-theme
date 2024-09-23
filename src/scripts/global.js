// import { scrollToEls } from './global/scrollTo';
// import headerInit from './sections/header/headerInit';
// import { initAnnouncementBar } from './sections/header/announcementBar';
// import cookieWarning from './dom/cookieWarning';
// import { clickToggle } from './global/clickToggle';
// import dismissablesInit from './components/dismissables';
// import initialiseZoom from './components/productZoom';
// import { initSort } from './sections/products/sort';
// import addToCartBtnInit from './sections/cart/addToCart';
// import initLoadMore from './sections/products/loadMore';
// import { ready, onShopifySectionLoad } from './global/instantiate';
// import initAccordion from './components/accordion';
// import { checkIfUserCanBeTracked, onConsentLoad, setTrackingConsent } from './dom/tracking';
// import allowGTMTracking from './dom/allowGTMTracking';
// import initLabelButtons from './global/labelButtons';
// import animations from './dom/animations';
// import initCopyUrl from './components/copyUrl';
// import getHeaderHeight from './global/getHeaderHeight';
// import { swipify, swipifyMob } from './dom/swipify';
// import { initVideo } from './dom/initVideo';
// import initAppHeight from './global/appHeight';
// import initHeaderHeight from './global/headerHeight';
// import { initGiftCard } from './template/gift-card';
// import { nostoUrls, nostoSwatches, nostoAtc } from './global/nostoHelpers';
// import initNewsletterPop from './components/newsletterPopup';
// import initLowPowerMode from './global/lowPowerMode';
// import { initGeo } from './global/geo';
// import initHotspotsBanner from './sections/hotspotBanner';
// import initQuantitySelector from './global/quantitySelector';
// const defaultWindowBlubolt = {
//   turboLinksActive: false,
//   stickers: {},
//   dom: {
//     initialiseZoom,
//     swipify,
//     swipifyMob,
//     nostoUrls,
//     nostoSwatches,
//     nostoAtc
//   },
//   consent: {
//     checkIfUserCanBeTracked,
//     setTrackingConsent
//   }
// };

// if (!window.blubolt) {
//   window.blubolt = defaultWindowBlubolt;
// } else {
//   window.blubolt = { ...window.blubolt, ...defaultWindowBlubolt };
// }

// ready(() => {
//   initLabelButtons();
//   initAnnouncementBar();
//   headerInit();
//   animations();
//   clickToggle();
//   dismissablesInit();
//   cookieWarning();
//   swipify();
//   swipifyMob();
//   initSort();
//   scrollToEls();
//   addToCartBtnInit();
//   initAccordion();
//   initCopyUrl();
//   getHeaderHeight();
//   initVideo();
//   initAppHeight();
//   initHeaderHeight();
//   initGiftCard();
//   initNewsletterPop();
//   initLowPowerMode();
//   initGeo();
//   initHotspotsBanner();
//   initQuantitySelector();
//   initLoadMore(() => {
//     console.info('Infinite scroll products loaded');
//   });

//   onConsentLoad(consent => {
//     if (consent) {
//       console.info('user allows tracking!');
//       allowGTMTracking();
//     }
//   });
// });

// onShopifySectionLoad(() => {
//   initAnnouncementBar();
//   headerInit();
//   animations();
//   clickToggle();
//   swipify();
//   swipifyMob();
//   initNewsletterPop();
//   initLowPowerMode();
//   initGeo();
//   initHotspotsBanner();
//   initQuantitySelector();

//   if (!window['nostojs']) {
//     return;
//   }

//   window['nostojs'](function (api) {
//     api.loadRecommendations({});
//   });

//   window['nostojs'](function (api) {
//     api.listen('postrender', function () {
//       if (window['blubolt']) {
//         window['blubolt'].dom.swipify();
//         window['blubolt'].dom.nostoUrls();
//         window['blubolt'].dom.nostoSwatches();
//         window['blubolt'].dom.nostoAtc();
//       }
//     });
//   });
// });
