// ensure these functions are added to footer-scripts.liquid, line 85-ish

import getTemplateJSON from "../utils/getTemplateJSON";

type variantMetafields = {
  metafields?: Record<string, string>;
};

const getSwatchImage = (productMetafields): any => {
  const swatchContent = [];
  const maxSwatches = 3;
  for (const [key, val] of Object.entries<variantMetafields>(
    productMetafields.variants,
  )) {
    val.metafields.variant_image
      ? swatchContent.push(
          `<div class="product-card-swatches__image"><img width="80" height="80" src=${val.metafields.variant_image} alt=${key} /></div>`,
        )
      : "";
  }

  if (swatchContent.length > maxSwatches) {
    const removeSwatches = swatchContent.length - maxSwatches;
    swatchContent.splice(swatchContent.length - removeSwatches, removeSwatches);
    swatchContent.push(
      `<div class="product-card-swatches__count">+${removeSwatches}</div>`,
    );
  }

  return swatchContent;
};

const getSwatchColour = (productMetafields): any => {
  const swatchContent = [];
  for (const [key, val] of Object.entries<variantMetafields>(
    productMetafields.variants,
  )) {
    val.metafields.swatch_colour
      ? swatchContent.push(
          `<div class="product-card-swatches__swatch" style="--bg: ${val.metafields.swatch_colour};" title="${key}"></div>`,
        )
      : "";
  }

  return swatchContent;
};

export const nostoUrls = (): void => {
  // nosto urls are missing the locale
  const nostoElems = document.querySelectorAll("[data-nosto-elem]");

  const siteUrl = window.location.href;

  if (!siteUrl.includes("/en")) return;
  if (!nostoElems.length) return;

  nostoElems.forEach((el) => {
    const anchors = el.querySelectorAll("a");

    anchors.forEach((anchor) => {
      const route = window["Shopify"].routes.root;
      const a = anchor.href;
      if (!a.includes("/en")) {
        // remove trailing /
        const b = route.substring(0, route.length - 1);
        const position = anchor.href.indexOf(".com")
          ? anchor.href.indexOf(".com") + 4
          : anchor.href.indexOf(".co.uk") + 4;
        const output = a.substring(0, position) + b + a.substring(position);
        anchor.href = output;
      }
    });
  });
};

export const nostoSwatches = (): void => {
  // we need to populate the swatches on the nosto sliders
  // as nosto doesn't give us access to variant metafields
  const nostoSwatches = document.querySelectorAll(
    "[data-nosto-swatches]",
  ) as NodeListOf<HTMLDivElement>;

  nostoSwatches.forEach(async (el) => {
    const isImages = el.classList.contains("product-card-swatches--images")
      ? true
      : false;
    const productHandle = el.dataset.nostoSwatches;
    const productData = await getTemplateJSON(
      "products",
      productHandle,
      "json-data",
    );

    if (isImages) {
      const elContent = getSwatchImage(productData);
      el.innerHTML = elContent.join("");
    } else {
      const elContent = getSwatchColour(productData);
      el.innerHTML = elContent.join("");
    }
  });
};

export const nostoAtc = (): void => {
  const upsellsEl = document.querySelectorAll(".swiper--upsells");

  const updateNostoAtc = (e) => {
    const el = e.target;
    const parent = el.closest(".minicart-upsell");
    const variantId = el.value;
    const atcEl = parent.querySelector(".btn");

    atcEl.removeAttribute("disabled");
    atcEl.dataset.atcProductId = variantId;
    atcEl.innerHTML = "Add to Bag";
  };

  const triggerNostoAtc = (e) => {
    const el = e.target;
    const variantId = parseInt(el.dataset.atcProductId);

    window["blubolt"].cart.addToCart([{ id: variantId, quantity: 1 }], true);
  };

  upsellsEl.forEach((upsell) => {
    const selectEls = upsell.querySelectorAll(".select");
    const atcButtons = upsell.querySelectorAll(".btn");

    selectEls.forEach((select) => {
      select.addEventListener("change", (e) => {
        updateNostoAtc(e);
      });
    });

    atcButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        triggerNostoAtc(e);
      });
    });
  });
};
