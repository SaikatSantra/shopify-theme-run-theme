function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document
    .querySelectorAll("product-model")
    .forEach((model) => model.modelViewerUI?.pause());
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll(".drawer_layer").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    console.log(event);
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
    document.body.classList.add("menu-open");
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
        document.body.classList.remove("menu-open"); // Added By Divy
      });
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      );
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening");
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.querySelector(".section-header");
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom"
      )
        ? 1
        : 0;
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset
      )}px`
    );

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
    document.body.classList.add("menu-open"); // Added By Divy
  }
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove("overflow-hidden");
    document.body.dispatchEvent(new CustomEvent("modalClosed"));
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();
    const button = this.querySelector("button");
    button?.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(this.getAttribute("data-modal"))?.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      "click",
      this.loadContent.bind(this)
    );
  }

  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      window.pauseAllMedia();
      this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      ).focus();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);

//product image Thumb Slider

class ThumbSliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector(".slider-counter--current");
    this.pageTotalElement = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientHeight > 0
    );
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset =
      this.sliderItemsToShow[1].offsetTop - this.sliderItemsToShow[0].offsetTop;
    this.slidesPerPage = Math.floor(
      (this.slider.clientHeight - this.sliderItemsToShow[0].offsetTop) /
        this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    const previousPage = this.currentPage;
    this.currentPage =
      Math.round(this.slider.scrollTop / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(
        new CustomEvent("slideChanged", {
          detail: {
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        })
      );
    }

    if (this.enableSliderLooping) return;

    // console.log(this.isSlideVisible(this, this.sliderItemsToShow.length));

    // console.log(this.slider.scrollLeft);
    // console.log(this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1]));
    // console.log("line 579");
    // console.log(this.isSlideVisible(this.sliderItemsToShow[0]));
    if (
      this.isSlideVisible(this.sliderItemsToShow[0]) &&
      this.slider.scrollTop === 0
    ) {
      this.prevButton.setAttribute("disabled", "disabled");
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (
      this.isSlideVisible(
        this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
      )
    ) {
      this.nextButton.setAttribute("disabled", "disabled");
    } else {
      this.nextButton.removeAttribute("disabled");
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide =
      this.slider.clientHeight + this.slider.scrollTop - offset;
    return (
      element.offsetTop + element.clientHeight <= lastVisibleSlide &&
      element.offsetTop >= this.slider.scrollTop
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollTop + step * this.sliderItemOffset
        : this.slider.scrollTop - step * this.sliderItemOffset;
    console.dir(this.slider);
    console.log(this.slideScrollPosition);
    this.slider.scrollTo({
      top: this.slideScrollPosition,
    });
  }
}
customElements.define("thumb-slider-component", ThumbSliderComponent);

// product image main Slider
class mainSliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = true;
    this.currentPageElement = this.querySelector(".slider-counter--current");
    this.pageTotalElement = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);
    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
    this.sliderControlWrapper = this.querySelector(".slider-buttons");
    this.sliderFirstItemNode = this.slider.querySelector(
      ".mainSlider-image .slider__slide "
    );
    this.sliderControlLinksArray = Array.from(
      this.sliderControlWrapper.querySelectorAll(".slider-counter__link")
    );
    this.sliderControlLinksArray.forEach((link) =>
      link.addEventListener("click", this.linkToSlide.bind(this))
    );
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    );
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset =
      this.sliderItemsToShow[1].offsetLeft -
      this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) /
        this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
    console.log(this.querySelector("ul").clientHeight);
    document.querySelector("thumb-slider-component ul").style.height =
      this.querySelector("ul").clientHeight + "px";
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    const previousPage = this.currentPage;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;
    // original backup
    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    this.sliderControlButtons = this.querySelectorAll(".slider-counter__link");
    // console.log(this.sliderControlButtons)
    this.prevButton.removeAttribute("disabled");

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove("slider-counter__link--active");
      link.removeAttribute("aria-current");
    });
    this.sliderControlButtons[this.currentPage - 1]?.classList.add(
      "slider-counter__link--active"
    );
    this.sliderControlButtons[this.currentPage - 1]?.setAttribute(
      "aria-current",
      true
    );

    if (this.currentPage != previousPage) {
      this.dispatchEvent(
        new CustomEvent("slideChanged", {
          detail: {
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        })
      );
    }
    if (this.enableSliderLooping) return;

    if (
      this.isSlideVisible(this.sliderItemsToShow[0]) &&
      this.slider.scrollLeft === 0
    ) {
      this.prevButton.setAttribute("disabled", "disabled");
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (
      this.isSlideVisible(
        this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
      )
    ) {
      this.nextButton.setAttribute("disabled", "disabled");
    } else {
      this.nextButton.removeAttribute("disabled");
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide =
      this.slider.clientWidth + this.slider.scrollLeft - offset;
    return (
      element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
      element.offsetLeft >= this.slider.scrollLeft
    );
  }

  onButtonClick(event) {
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + step * this.sliderItemOffset
        : this.slider.scrollLeft - step * this.sliderItemOffset;
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
    this.update();
  }
  linkToSlide(event) {
    event.preventDefault();
    // console.log(event.currentTarget)
    const step = event.currentTarget.dataset.step || 1;
    const slideScrollPosition =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(event.currentTarget) +
          1 -
          this.currentPage);
    // console.log(slideScrollPosition)
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}
customElements.define("main-slider-component", mainSliderComponent);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector("ul");
    this.sliderItems = this.querySelectorAll("li");
    this.pageCount = this.querySelector(".slider-counter--current");
    this.pageTotal = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(
      this.slider.clientWidth / this.sliderItems[0].clientWidth
    );
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

    if (this.currentPage === 1) {
      this.prevButton.setAttribute("disabled", true);
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute("disabled", true);
    } else {
      this.nextButton.removeAttribute("disabled");
    }

    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + this.sliderItems[0].clientWidth
        : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}
customElements.define("slider-component", SliderComponent);

// Slideshow
class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector(".slider-buttons");
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector(".slideshow__slide");
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.sliderControlLinksArray = Array.from(
      this.sliderControlWrapper.querySelectorAll(".slider-counter__link")
    );
    this.sliderControlLinksArray.forEach((link) =>
      link.addEventListener("click", this.linkToSlide.bind(this))
    );
    this.slider.addEventListener("scroll", this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.slider.getAttribute("data-autoplay") === "true")
      this.setAutoPlay();
  }

  setAutoPlay() {
    this.sliderAutoplayButton = this.querySelector(".slideshow__autoplay");
    this.autoplaySpeed = this.slider.dataset.speed * 1000;

    this.sliderAutoplayButton.addEventListener(
      "click",
      this.autoPlayToggle.bind(this)
    );
    this.addEventListener("mouseover", this.focusInHandling.bind(this));
    this.addEventListener("mouseleave", this.focusOutHandling.bind(this));
    this.addEventListener("focusin", this.focusInHandling.bind(this));
    this.addEventListener("focusout", this.focusOutHandling.bind(this));

    this.play();
    this.autoplayButtonIsSetToPlay = true;
  }

  onButtonClick(event) {
    console.log(event);
    super.onButtonClick(event);
    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) return;

    if (isFirstSlide && event.currentTarget.name === "previous") {
      this.slideScrollPosition =
        this.slider.scrollLeft +
        this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === "next") {
      this.slideScrollPosition = 0;
    }
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll(".slider-counter__link");
    console.log(this.sliderControlButtons);
    this.prevButton.removeAttribute("disabled");

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove("slider-counter__link--active");
      link.removeAttribute("aria-current");
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add(
      "slider-counter__link--active"
    );
    this.sliderControlButtons[this.currentPage - 1].setAttribute(
      "aria-current",
      true
    );
  }

  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
    this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
    this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
  }

  focusOutHandling(event) {
    const focusedOnAutoplayButton =
      event.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(event.target);
    if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
    this.play();
  }

  focusInHandling(event) {
    const focusedOnAutoplayButton =
      event.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(event.target);
    if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
      this.play();
    } else if (this.autoplayButtonIsSetToPlay) {
      this.pause();
    }
  }

  play() {
    this.slider.setAttribute("aria-live", "off");
    clearInterval(this.autoplay);
    this.autoplay = setInterval(
      this.autoRotateSlides.bind(this),
      this.autoplaySpeed
    );
  }

  pause() {
    this.slider.setAttribute("aria-live", "polite");
    clearInterval(this.autoplay);
  }

  togglePlayButtonState(pauseAutoplay) {
    if (pauseAutoplay) {
      this.sliderAutoplayButton.classList.add("slideshow__autoplay--paused");
      this.sliderAutoplayButton.setAttribute(
        "aria-label",
        window.accessibilityStrings.playSlideshow
      );
    } else {
      this.sliderAutoplayButton.classList.remove("slideshow__autoplay--paused");
      this.sliderAutoplayButton.setAttribute(
        "aria-label",
        window.accessibilityStrings.pauseSlideshow
      );
    }
  }

  autoRotateSlides() {
    const slideScrollPosition =
      this.currentPage === this.sliderItems.length
        ? 0
        : this.slider.scrollLeft +
          this.slider.querySelector(".slideshow__slide").clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }

  setSlideVisibility() {
    this.sliderItemsToShow.forEach((item, index) => {
      const button = item.querySelector("a");
      if (index === this.currentPage - 1) {
        if (button) button.removeAttribute("tabindex");
        item.setAttribute("aria-hidden", "false");
        item.removeAttribute("tabindex");
      } else {
        if (button) button.setAttribute("tabindex", "-1");
        item.setAttribute("aria-hidden", "true");
        item.setAttribute("tabindex", "-1");
      }
    });
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(event.currentTarget) +
          1 -
          this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}
customElements.define("slideshow-component", SlideshowComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
    var variant = this.currentVariant;
    // var thisVariantPrice  = $("dl dd span.price-item").html();
    // var currencySymbol = thisVariantPrice.replace(/[\d,.\s]/g, "");
    // alert(thisVariantPrice);
    // $(".installment").hide();
    // $("#"+variant.id).show();

    // $(".thumbvar-"+variant.id).click();
    // $(".thumbvar-"+variant.id+" button.thumbnail").click();

    var thisPrice = variant.price / 100;
    // alert(thisPrice);
    // $("dl  dd span.price-item").html(currencySymbol+thisPrice);
    var compare_at_price = variant.compare_at_price / 100;
    //console.log(compare_at_price);
    // if(variant.available){
    //   $(".product__info-wrapper .product-heading-container .price.price--large").removeClass("price--sold-out");

    //   // alert("true");
    // }
    // else{
    //   $(".product__info-wrapper .product-heading-container .price.price--large").addClass("price--sold-out");

    //   // alert("false");
    // }
    // if(compare_at_price !=0){
    //   $(".product__info-wrapper .product-heading-container .price.price--large").addClass("price--on-sale");
    //   $("dl dd.price__compare s.price-item").html(currencySymbol+compare_at_price);
    // }
    // else{
    //   $(".product__info-wrapper .product-heading-container .price.price--large").removeClass("price--on-sale");
    //   $("dl dd.price__compare  s.price-item").html("");
    // }

    //console.log(inv_qty[ variant.id ]);
    //    console.log(variant);
    // console.log(this.currentVariant);

    var qty = inv_qty[this.currentVariant.id];
    var inventoryContainer = document.querySelector(".inventory-container");

    if (qty > 0 && this.currentVariant.available && qty <= inventoryThreshold) {
      inventoryContainer.className =
        "inventory-container remaining-stock-container";
      inventoryContainer.innerHTML =
        lowStock +
        '<span class="stock-text">' +
        "Only" +
        "<strong> " +
        qty +
        " </strong>" +
        "Left in Stock" +
        "</span>";
    } else if (qty > inventoryThreshold) {
      inventoryContainer.className = "inventory-container in-stock";
      inventoryContainer.innerHTML = stock;
    } else {
      inventoryContainer.className = "inventory-container out-of-stock";
      inventoryContainer.innerHTML = outOfStock;
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedias = document.querySelectorAll(`[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`);
    
    console.log(this);
    
    // thumb 
    const thumbnaillistitemvariants = document.querySelectorAll('.thumbnail-list_item--variant');
    thumbnaillistitemvariants.forEach((thumbnaillistitemvariant) => {
    thumbnaillistitemvariant.classList.add('hide');
    });
    // newMedia.classList.remove('hide');
    // main gal
    const mainlistitemvariants = document.querySelectorAll('.product__media-item--variant');
    mainlistitemvariants.forEach((mainlistitemvariant) => {
    mainlistitemvariant.classList.add('hide');
    });
      console.log(mainlistitemvariants);
    newMedias.forEach(function (newMedia) {      
      newMedia.classList.remove('hide');
      console.log(newMedia);
      if (!newMedia) return;
      const parent = newMedia.parentElement;
      // parent.innerHTML = '';
      parent.prepend(newMedia);
      newMedia.querySelector("button.thumbnail")?.click();
      console.log(parent);
      parent.scrollTop = 0;
      window.setTimeout(() => {
        parent.scroll(0, 0);
      });
    });
  }

  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant?.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const destination = document.getElementById(id);
        const source = html.getElementById(id);
        if (source && destination) destination.innerHTML = source.innerHTML;
        document
          .getElementById(`price-${this.dataset.section}`)
          ?.classList.remove("visibility-hidden");

        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        );
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector('[name="add"]');
    const dummyBtn = document.querySelector(".product-form__submit-dummy");
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", true);
      if (text) addButton.textContent = text;
      dummyBtn.setAttribute("disabled", true);
      dummyBtn.classList.add("disabled");
      if (text) dummyBtn.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButton.textContent = window.variantStrings.addToCart;
      dummyBtn.removeAttribute("disabled");
      dummyBtn.classList.remove("disabled");
      dummyBtn.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector('[name="add"]');
    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    document
      .getElementById(`price-${this.dataset.section}`)
      ?.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
}

var ShopTheLook__Dot = document.querySelectorAll(".ShopTheLook__Dot");
var cardPrds = document.querySelectorAll(".custom_products .product_item");

ShopTheLook__Dot.forEach(function (title) {
  title.addEventListener("click", function () {
    var this_idd = this.getAttribute("data-product");
    var siblings = Array.from(this.parentElement.children).filter(function (
      element
    ) {
      return element !== this;
    },
    this);

    siblings.forEach(function (sibling) {
      sibling.classList.remove("is-active");
    });

    // Add "active" class to current element
    this.classList.add("is-active");

    cardPrds.forEach(function (cardPrd) {
      cardPrd.classList.remove("avtive");
      if (cardPrd.classList.contains("product_item-" + this_idd)) {
        cardPrd.classList.add("avtive");
      }
    });
  });
  title.addEventListener("mouseenter", function () {
    var this_idd = this.getAttribute("data-product");
    var siblings = Array.from(this.parentElement.children).filter(function (
      element
    ) {
      return element !== this;
    },
    this);

    siblings.forEach(function (sibling) {
      sibling.classList.remove("is-active");
    });

    // Add "active" class to current element
    this.classList.add("is-active");

    cardPrds.forEach(function (cardPrd) {
      cardPrd.classList.remove("avtive");
      if (cardPrd.classList.contains("product_item-" + this_idd)) {
        cardPrd.classList.add("avtive");
      }
    });
  });
});

// $(".ShopTheLook__Dot").click(function () {
//   $(this).addClass("active");
//   $(this).siblings(".ShopTheLook__Dot").removeClass("active");

// });

// $(document).ready(function() {

//     if ($(window).width() <= 989){

//       var bfeImg = $(".after img");
//       var imgwidth = bfeImg.width();
//       var imgheight = bfeImg.height();

//       $(".before img").css("width", imgwidth);
//       $(".before img").css("height", imgheight);
//       console.log(imgwidth + " " + imgheight);
//     }

//     $(window).resize(function(){
//        if ($(window).width() <= 989){

//             var bfeImg = $(".after img");
//             var imgwidth = bfeImg.width();
//             var imgheight = bfeImg.height();

//             $(".before img").css("width", imgwidth);
//             $(".before img").css("height", imgheight);
//             console.log(imgwidth + " " + imgheight);
//           }
//     });

//     $("input.slider").on("input change", function(event) {
//         var element = $(this).parents("div.container");
//         var pos = event.target.value;

//         element.find("div.before").css({width: pos + "%"});
//         element.find("div.slider-button").css({left: "calc(" + pos + "% - 16px)"});

//     });

// });

customElements.define("variant-radios", VariantRadios);
// Added By Divy
// $(function(){

//   $('.hover-nav.hover-enable').hover(function(){
// 		//     $(this).find('ul').first().stop().toggle(200);
// 		$(this).find('ul').addClass('header__submenu_hover');
//   }, function(){
// 		//     $(this).find('ul').stop().hide(200);
// 		$(this).find('ul').removeClass('header__submenu_hover');
//   });

// });

// Added By Saikat
document.addEventListener('DOMContentLoaded', function() {
  var hoverNavElements = document.querySelectorAll('.hover-nav.hover-enable');
  hoverNavElements.forEach(function(element) {
    element.addEventListener('mouseenter', function() {
      var uls = element.querySelectorAll('ul');
      uls.forEach(function(ul) {
        ul.classList.add('header__submenu_hover');
      });
    });
    element.addEventListener('mouseleave', function() {
      var uls = element.querySelectorAll('ul');
      uls.forEach(function(ul) {
        ul.classList.remove('header__submenu_hover');
      });
    });
  });
});







// // added by Liam - Animation fix
// window.addEventListener("load", AOS.refresh);
