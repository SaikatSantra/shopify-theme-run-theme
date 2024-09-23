export const initProductVideo = (): void => {
  const videoContainers = document.querySelectorAll('[data-yt-video]');
  if (videoContainers.length <= 0) return;

  const pauseYTVideo = () => {
    videoContainers.forEach((videoContainer) => {
      const iframe: HTMLIFrameElement = videoContainer.querySelector('iframe');
      if (iframe) {
        const iframeContent = iframe.contentWindow;
        iframeContent.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  }

  document.querySelector('[data-modal-underlay]').addEventListener('click', function () {
    pauseYTVideo();
  });
}