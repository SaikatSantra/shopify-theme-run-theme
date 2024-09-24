if (!customElements.get("quick-add-modal")) {
  customElements.define(
    "quick-add-modal",
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
      }

      hide(preventFocus = false) {
        const cartNotification =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        if (cartNotification) cartNotification.setActiveElement(this.openedBy);
        this.modalContent.innerHTML = "";

        if (preventFocus) this.openedBy = null;
        super.hide();
      }

      show(opener) {
        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");
        opener.querySelector(".loading__spinner").classList.remove("hidden");

        fetch(opener.getAttribute("data-product-url"))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            this.productElement = responseHTML.querySelector(
              'section[id^="MainProduct-"]'
            );
            this.productElement.classList.forEach((classApplied) => {
              if (
                classApplied.startsWith("color-") ||
                classApplied === "gradient"
              )
                this.modalContent.classList.add(classApplied);
            });
            this.preventDuplicatedIDs();
            this.removeDOMElements();
            this.setInnerHTML(this.modalContent, this.productElement.innerHTML);

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }

            if (window.ProductModel) window.ProductModel.loadShopifyXR();

            this.removeGalleryListSemantic();
            this.updateImageSizes();
            this.preventVariantURLSwitching();
            super.show(opener);
          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");
            opener.querySelector(".loading__spinner").classList.add("hidden");

            async function waitForImagesToLoad() {
              const images = Array.from(
                document.querySelectorAll('[id^="Thumbnail-template--"]')
              );

              const promises = images.map((mainImage) => {
                return new Promise((resolve) => {
                  if (mainImage.complete) {
                    resolve();
                  } else {
                    mainImage.addEventListener("load", resolve);
                  }
                });
              });

              await Promise.all(promises);
            }

            async function init() {
              await waitForImagesToLoad();
              productGallerySliderInitialise();
            }

            init();
          });
      }

      setInnerHTML(element, html) {
        element.innerHTML = html;

        // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
        element.querySelectorAll("script").forEach((oldScriptTag) => {
          const newScriptTag = document.createElement("script");
          Array.from(oldScriptTag.attributes).forEach((attribute) => {
            newScriptTag.setAttribute(attribute.name, attribute.value);
          });
          newScriptTag.appendChild(
            document.createTextNode(oldScriptTag.innerHTML)
          );
          oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
        });
      }

      preventVariantURLSwitching() {
        const variantPicker =
          this.modalContent.querySelector("variant-selects");
        if (!variantPicker) return;

        variantPicker.setAttribute("data-update-url", "false");
      }

      removeDOMElements() {
        const pickupAvailabilityElement = this.productElement.querySelector(
          "pickup-availability"
        );
        if (pickupAvailabilityElement) pickupAvailabilityElement.remove();

        const productModal = this.productElement.querySelector("product-modal");
        if (productModal) productModal.remove();

        const modalDialog =
          this.productElement.querySelectorAll("modal-dialog");
        if (modalDialog) modalDialog.forEach((modal) => modal.remove());
      }

      preventDuplicatedIDs() {
        const sectionId = this.productElement.dataset.section;
        this.productElement.innerHTML =
          this.productElement.innerHTML.replaceAll(
            sectionId,
            `quickadd-${sectionId}`
          );
        this.productElement
          .querySelectorAll("variant-selects, product-info")
          .forEach((element) => {
            element.dataset.originalSection = sectionId;
          });
      }

      removeGalleryListSemantic() {
        const galleryList = this.modalContent.querySelector(
          '[id^="Slider-Gallery"]'
        );
        if (!galleryList) return;

        galleryList.setAttribute("role", "presentation");
        galleryList
          .querySelectorAll('[id^="Slide-"]')
          .forEach((li) => li.setAttribute("role", "presentation"));
      }

      updateImageSizes() {
        const product = this.modalContent.querySelector(".product");
        const desktopColumns = product.classList.contains("product--columns");
        if (!desktopColumns) return;

        const mediaImages = product.querySelectorAll(".product__media img");
        if (!mediaImages.length) return;

        let mediaImageSizes =
          "(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

        if (product.classList.contains("product--medium")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "605px");
        } else if (product.classList.contains("product--small")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "495px");
        }

        mediaImages.forEach((img) =>
          img.setAttribute("sizes", mediaImageSizes)
        );
      }
    }
  );
}

if (!customElements.get("product-card-form")) {
  customElements.define(
    "product-card-form",
    class ProductCardForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cartNotification = document.querySelector("cart-notification");
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        this.cartNotification.setActiveElement(document.activeElement);

        const submitButton = this.querySelector('[type="submit"]');

        submitButton.setAttribute("disabled", true);
        submitButton.classList.add("loading");
        submitButton
          .querySelector(".loading__spinner")
          .classList.remove("hidden");

        const config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        const formData = new FormData(this.form);

        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((parsedState) => {
            //mini cart section render
            fetch("/?sections=cart-items")
              .then((response) => response.json())
              .then((data) => {
                var SectionHtml = data["cart-items"];
                var IDminiCart = document.getElementById("mini-cart");
                var IDminiCartMask = document.getElementById("minibag_mask");
                IDminiCart.innerHTML = SectionHtml;
                IDminiCart.classList.add("show-minibag");
                IDminiCart.classList.remove("hide-minibag");
                IDminiCartMask.style.display = "block";
              });
            fetch("/cart.js")
              .then((response) => response.json())
              .then((cart) => {
                document.getElementById("CartCount").innerHTML =
                  cart.item_count;
              });
          })

          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            submitButton.classList.remove("loading");
            submitButton.removeAttribute("disabled");
            submitButton
              .querySelector(".loading__spinner")
              .classList.add("hidden");
          });
      }
    }
  );
}
