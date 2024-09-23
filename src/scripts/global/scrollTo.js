import safeJSONParse from "../utils/safeJsonParse";

export const scrollTo = (selector, opts) => {
  //make smooth default:
  if (!selector) {
    return false;
  }
  const options = opts ? opts : {};
  if (!options.behavior) {
    options.behavior = "smooth";
  }
  const target = document.querySelector(selector);
  if (!options.top) {
    options.top = target.offsetTop;
  }
  if (!target) {
    return false;
  }
  window.scrollTo(options);
  return true;
};

export const scrollToEls = () => {
  const els = document.querySelectorAll("[data-scroll-smooth]");
  els.forEach((el) => {
    const href = el.getAttribute("href");
    if (!href || href.substring(0, 1) !== "#") {
      return;
    }

    let opts = {};
    if (el.dataset.scrollSmooth) {
      opts = safeJSONParse(el.dataset.scrollSmooth);
    }

    const selector = href === "#" ? "body" : href;
    el.addEventListener("click", (e) => {
      // Header Top offset
      const target = document.querySelector(selector);
      const header = document.querySelector("header.header");
      const headerPosition = getComputedStyle(header).position;
      const headerHeight = window["blubolt"].headerHeight
        ? window["blubolt"].headerHeight
        : header.offsetHeight;
      let headerOffset = 36;
      if (!target) {
        return;
      }
      if (headerPosition === "sticky" || headerPosition === "fixed") {
        headerOffset += headerHeight;
      }

      opts["top"] = target.offsetTop - headerOffset;
      scrollTo(selector, opts);
      e.preventDefault();
    });
  });
};

export default scrollToEls;
