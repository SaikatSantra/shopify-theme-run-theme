// used to handle low power play / pause on mobile background video

const forceNativeVideoPlay = e => {
  const BREAKPOINT = 1280;
  const target = e.target;
  let nearestVideo = target
    .closest('.shopify-section')
    .querySelector('.video-container--single[data-native-video] video');
  const desktopVideo = target
    .closest('.shopify-section')
    .querySelector('.video-container--desktop[data-native-video] video');
  const mobileVideo = target
    .closest('.shopify-section')
    .querySelector('.video-container--mobile[data-native-video] video');

  if (window.innerWidth >= BREAKPOINT) {
    nearestVideo = desktopVideo;
  } else {
    nearestVideo = mobileVideo;
  }

  if (!nearestVideo) return;

  nearestVideo.play();
};

const nativeVideoAutoplay = () => {
  const videoEls = document.querySelectorAll('[data-native-video] video');
  if (!videoEls.length) return;

  let videoIsPlaying = false;

  videoEls.forEach(video => {
    if (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
      videoIsPlaying = true;
    }
  });

  if (!videoIsPlaying) {
    videoEls.forEach(video => {
      const allChildren = video.closest('.shopify-section').children;
      allChildren.forEach(child => {
        child.addEventListener('click', forceNativeVideoPlay);
      });
      video.addEventListener('play', () => {
        allChildren.forEach(child => {
          child.removeEventListener('click', forceNativeVideoPlay);
        });
      });
    });
  }
};

const forceYouTubeVideoPlay = e => {
  const BREAKPOINT = 1280;
  const target = e.target;
  let nearestVideo = target.closest('.shopify-section').querySelector('.video-container--single[data-yt-video]');
  const desktopVideo = target.closest('.shopify-section').querySelector('.video-container--desktop[data-yt-video]');
  const mobileVideo = target.closest('.shopify-section').querySelector('.video-container--mobile[data-yt-video]');

  if (window.innerWidth >= BREAKPOINT) {
    nearestVideo = desktopVideo;
  } else {
    nearestVideo = mobileVideo;
  }

  if (!nearestVideo) return;
  const iframe = nearestVideo.querySelector('iframe');
  if (!iframe) return;
  const iframeContent = iframe.contentWindow;
  iframeContent.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
};

const youTubeVideoAutoplay = () => {
  const videoEls = document.querySelectorAll('[data-yt-video]');

  if (!videoEls.length) return;

  videoEls.forEach(video => {
    const allChildren = video.closest('.shopify-section').children;
    const iframe = video.querySelector('iframe');
    if (!iframe) return;
    const iframeContent = iframe.contentWindow;
    allChildren.forEach(child => {
      child.addEventListener('click', forceYouTubeVideoPlay);
    });
    iframe.addEventListener('load', () => {
      iframeContent.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    });
  });
};

const initLowPowerMode = () => {
  // Testing if we're on a mobile device using check as recommended by Mozilla
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
  if (!isMobileDevice) return;
  nativeVideoAutoplay();
  youTubeVideoAutoplay();

  window.addEventListener('resize', () => {
    nativeVideoAutoplay();
    youTubeVideoAutoplay();
  });
};

export default initLowPowerMode;
