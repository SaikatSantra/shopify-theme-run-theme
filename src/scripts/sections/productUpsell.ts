/**
 * This function adds handlers for multiple variant product upsells.
 */
export const initProductUpsell = (): void => {
  const triggerBtn = document.querySelectorAll("[data-product-upsell-trigger]");
  if (triggerBtn.length <= 0) return;

  // Toggle buttons
  triggerBtn.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", () => {
      btn.classList.add("hide");
      const id = btn.dataset.productUpsellTrigger;
      document
        .querySelector(`[data-upsell-item="${id}"] form`)
        .classList.remove("hide");
    });
  });

  // Option switcher handler
  document
    .querySelectorAll("[data-upsell-option-selector]")
    .forEach((selector: HTMLSelectElement) => {
      selector.addEventListener("change", (e) => {
        const target = <HTMLSelectElement>e.target;
        const selectedOption = selector.options[target.selectedIndex];
        const id = selector.dataset.upsellOptionSelector;

        const parent = document.querySelector(`[data-upsell-item="${id}"]`);
        const { variantPrice, variantImage } = selectedOption.dataset;

        if (variantImage) {
          const imgTarget: HTMLImageElement =
            parent.querySelector("[data-upsell-image");
          imgTarget.src = variantImage;
        }

        if (variantPrice) {
          const priceTarget = parent.querySelector("[data-upsell-price]");
          priceTarget.innerHTML = `<span>${variantPrice}</span>`;
        }

        const atcButton = parent.querySelector(
          "[data-add-to-cart-with-variant]",
        );
        if (!selectedOption.value) {
          atcButton.setAttribute("disabled", "disabled");
        } else {
          atcButton.setAttribute("data-atc-product-id", selectedOption.value);
          atcButton.removeAttribute("disabled");
        }
      });
    });
};
