import LazyLoad from "lazyload";

const lazyloadify = () => {
  if (!window.blubolt) {
    return;
  }
  if (!window.blubolt.lazyLoadInstance) {
    window.blubolt.lazyLoadInstance = new LazyLoad({
      use_native: true,
      elements_selector: "[data-lazy-load]",
    });
  } else {
    window.blubolt.lazyLoadInstance.update();
  }
};
export default lazyloadify;
