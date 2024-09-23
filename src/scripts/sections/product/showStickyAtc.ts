const showStickyAtc = (): void => {
  const toggleElement = document.querySelector(
    ".product-sticky-atc",
  ) as HTMLElement;
  if (!toggleElement) {
    return;
  }

  const toggleTrigger: HTMLDivElement = document.querySelector(
    "[data-product-form] [data-product-form-submit]",
  );

  if (!toggleTrigger) {
    return;
  }

  let togglePosition = toggleTrigger.offsetTop;

  window.addEventListener("resize", () => {
    togglePosition = toggleTrigger.offsetTop;
  });

  document.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > togglePosition) {
      toggleElement.classList.add("product-sticky-atc--show");
    } else {
      toggleElement.classList.remove("product-sticky-atc--show");
    }
  });
};

export default showStickyAtc;
