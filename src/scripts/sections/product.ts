import { DEFAULTS } from "./product/CONSTANTS";

import axiosGetFullProductJSON from "./product/axiosGetFullProductJSON";
import mapOptionsByImageIndex from "./product/mapOptionsByImageIndex";
import getSizedImage from "./product/getSizedImage";
import getVariantImageUrl from "./product/getVariantImageUrl";
import getImageUrlByPosition from "./product/getImageUrlByPosition";
import getCurrentSelectedOptionsFromFields from "./product/getCurrentSelectedOptionsFromFields";
import updatePrice from "./product/updatePrice";
import updateVariantFormField from "./product/updateVariantFormField";
import switchStockDisplay from "./product/switchStockDisplay";
import getVariantFromVariantsAndOptions from "./product/getVariantFromVariantsAndOptions";
import updateVariantUrl from "./product/updateVariantUrl";
import setActiveThumbnail from "./product/setActiveThumbnail";

import getMatchingOptionsFromImageIndex from "./product/getMatchingOptionsFromImageIndex";
import getClosestOptionsToCurrentlySelected from "./product/getClosestOptionsToCurrentlySelected";
import getVariantById from "./product/getVariantById";
import updateSelects from "./product/updateSelects";
import getThumbnailPosition from "./product/getThumbnailPosition";

import safeJSONParse from "../utils/safeJsonParse";

import { ProductVariant, Product } from "../../app-layer/util/typings";

export const productInit = async (
  options: typeof DEFAULTS,
  productUpdatedCallBack = (variant: ProductVariant) => variant,
): Promise<void> => {
  const opts = { ...DEFAULTS, options };

  const productForms = document.querySelectorAll(
    opts.PRODUCT_FORM_SELECTOR,
  ) as NodeListOf<HTMLFormElement>;

  if (productForms.length === 0) {
    return;
  }

  productForms.forEach(async (productForm) => {
    //get the data
    const productData: Product | void = await axiosGetFullProductJSON(
      productForm.dataset.productForm,
    );

    if (!productData) {
      return;
    }

    const optionsByImageIndex = mapOptionsByImageIndex(productData.variants);

    //get all the elements
    const variantIdFormField = productForm.querySelector(
      opts.PRODUCT_VARIANT_ID_FORM_FIELD,
    ) as HTMLInputElement;
    const sellingPlanIdEl = productForm.querySelector(
      opts.PRODUCT_SELLING_PLAN_ID,
    ) as HTMLInputElement;
    const atcButton = productForm.querySelector(
      opts.PRODUCT_FORM_SUBMIT_BUTTON_SELECTOR,
    ) as HTMLButtonElement;
    const priceEls = productForm.querySelectorAll(opts.PRODUCT_PRICE_SELECTOR);
    const compareAtpriceEls = productForm.querySelectorAll(
      opts.PRODUCT_COMPARE_AT_PRICE_SELECTOR,
    );
    const mainImage = productForm.querySelector(
      opts.PRODUCT_MAIN_IMAGE_SELECTOR,
    ) as HTMLImageElement;
    const optionFields = productForm.querySelectorAll(
      opts.PRODUCT_OPTION_FIELD_SELECTOR,
    ) as NodeListOf<HTMLSelectElement | HTMLInputElement>;
    const imageThumbs = productForm.querySelectorAll(
      opts.PRODUCT_IMAGE_THUMBS_SELECTOR,
    );
    const lowStockLabel = productForm.querySelector(
      "[data-variant-stock-display-low-stock]",
    );
    const dummyAtcButton = productForm.querySelector(
      opts.PRODUCT_FORM_DUMMY_SUBMIT_BUTTON_SELECTOR,
    );
    const dummySizeSelect = productForm.querySelector(
      opts.PRODUCT_DUMMY_OPTION_FIELD_SELECTOR,
    ) as HTMLSelectElement;
    const lowStockLimit = parseInt(productForm.dataset.lowStockLimit);

    const stockMap: boolean | any[] | Record<string, unknown> = (() => {
      try {
        return safeJSONParse(productForm.getAttribute(opts.PRODUCT_STOCK_MAP));
      } catch (e) {
        console.info("No stockmap on product form");
        return {};
      }
    })();

    const updateProductPrice = updatePrice(
      priceEls,
      compareAtpriceEls,
      window["theme"].moneyFormat,
    );
    const updateProductVariantFormField = updateVariantFormField(
      variantIdFormField,
      productData.handle,
    );

    const switchProductStockDisplay = switchStockDisplay({
      stockWrapper: productForm,
      stockWrapperAttr: opts.PRODUCT_STOCK_WRAPPER_ATTR,
      atcButton,
      oosAttr: opts.PRODUCT_OOS_TEXT_ATTR,
      inStockAttr: opts.PRODUCT_IN_STOCK_TEXT_ATTR,
      unavailableAttr: opts.PRODUCT_UNAVAILABLE_TEXT_ATTR,
      preOrderAttr: opts.PRODUCT_PRE_ORDER_ATTR,
      dummyAtcButton,
    });

    const setLowStockQty = (qty?: string) => {
      if (!lowStockLabel) {
        return;
      }
      const lowStockLabelHtml = lowStockLabel.innerHTML;
      const lowStocknewLabel = lowStockLabelHtml.replace(/([0-9]+)/, qty);
      lowStockLabel.innerHTML = lowStocknewLabel;
    };

    const getAvailabilityFlag = (variant?: ProductVariant) =>
      variant && stockMap[variant.id.toString()]
        ? stockMap[variant.id.toString()]["availability"]
        : "unavailable";
    const getVariantQty = (variant?: ProductVariant) =>
      variant && stockMap[variant.id.toString()]
        ? stockMap[variant.id.toString()]["qty"]
        : "0";
    const getSellingPlanId = (variant?: ProductVariant) =>
      variant && stockMap[variant.id.toString()]
        ? stockMap[variant.id.toString()]["selling_plan_id"]
        : null;

    const updateStockDisplay = (variant?: ProductVariant) => {
      const flag = getAvailabilityFlag(variant);
      switchProductStockDisplay(flag);
    };

    const updateLabel = () => {
      const variantSelectedEl = productForm.querySelectorAll(
        "[data-option-select]:checked",
      ) as NodeListOf<HTMLInputElement>;
      variantSelectedEl.forEach((el) => {
        const variantSelectedParent = el.closest("[data-variant-option]");
        const matchingLabel = productForm.querySelector(`[for="${el.id}"]`);
        variantSelectedParent.querySelector(
          "[data-variant-selected]",
        ).innerHTML = matchingLabel.innerHTML;
      });
    };

    const updateDummySelect = () => {
      const selectedVariant = (
        productForm.querySelector(
          ".variant-option__radio:checked",
        ) as HTMLInputElement
      ).dataset.optionValue;
      if (!dummySizeSelect) return;
      dummySizeSelect.value = selectedVariant;
    };

    const setSellingPlanId = (sPId?: number) => {
      if (!sPId) {
        return;
      }
      sellingPlanIdEl.value = sPId.toString();
    };

    const updateVariantData = (variant?: ProductVariant) => {
      updateLabel();
      updateDummySelect();
      if (variant) {
        updateStockDisplay(variant);
        updateVariantUrl(variant);
        updateProductPrice(variant);
        updateProductVariantFormField(variant);
        productUpdatedCallBack(variant);
        const qty = getVariantQty(variant);
        setLowStockQty(qty);
        const sPId = getSellingPlanId(variant);
        if (!sPId) return;
        setSellingPlanId(sPId);
      }
    };

    const updateProductToMatchThumbnail = (position: number) => {
      const matchingOptions = getMatchingOptionsFromImageIndex(
        optionsByImageIndex,
        position,
      );
      const currentlySelectedOptions =
        getCurrentSelectedOptionsFromFields(optionFields);
      const closest = getClosestOptionsToCurrentlySelected(
        currentlySelectedOptions,
        matchingOptions,
      );
      if (!closest) {
        return;
      }
      const { id, options } = closest;
      const variant = getVariantById(productData.variants, id);
      updateSelects(optionFields, options);
      updateVariantData(variant);
    };

    const onFieldsChange =
      (fields: NodeListOf<HTMLSelectElement | HTMLInputElement>) => () => {
        const currentOptions = getCurrentSelectedOptionsFromFields(fields);
        const variant = getVariantFromVariantsAndOptions(
          productData.variants,
          currentOptions,
        );
        updateVariantData(variant);
        if (!variant) {
          return;
        }
        const imageUrl = getVariantImageUrl(variant);
        if (!imageUrl) {
          return;
        }
        const sizedImage = getSizedImage(imageUrl, opts.IMAGE_SIZE);
        if (!mainImage) return;
        mainImage.dataset.rawSrc = imageUrl;
        mainImage.src = sizedImage;
      };

    const onProductThumbnailClick = (thumbnail: Element) => () => {
      const position = getThumbnailPosition(
        opts.PRODUCT_IMAGE_THUMBS_ATTR,
        thumbnail,
      );
      setActiveThumbnail(
        imageThumbs,
        opts.PRODUCT_IMAGE_THUMBS_ATTR,
        opts.PRODUCT_THUMBNAIL_ACTIVE_CLASS,
        position,
      );
      const imageUrl = getImageUrlByPosition(productData.images, position);
      const sizedImage = getSizedImage(imageUrl, opts.IMAGE_SIZE);
      if (!mainImage) return;
      mainImage.dataset.rawSrc = imageUrl;
      mainImage.src = sizedImage;
      if (opts.SWITCH_OPTIONS_ON_THUMBNAIL_SELECTION) {
        updateProductToMatchThumbnail(position);
      }
    };

    const onDummySelectChange = (e: Event) => {
      const selectedOption = (e.target as HTMLSelectElement).value;
      const variantOption = productForm.querySelector(
        `input[data-option-value='${selectedOption}']`,
      ) as HTMLInputElement;
      variantOption.click();
    };

    const onDummyAtcClick = () => {
      atcButton.click();
    };

    dummySizeSelect
      ? dummySizeSelect.addEventListener("change", (e) =>
          onDummySelectChange(e),
        )
      : "";

    dummyAtcButton
      ? dummyAtcButton.addEventListener("click", () => onDummyAtcClick())
      : "";

    optionFields.forEach((select) =>
      select.addEventListener("change", onFieldsChange(optionFields)),
    );

    imageThumbs.forEach((thumbnail) =>
      thumbnail.addEventListener("click", onProductThumbnailClick(thumbnail)),
    );

    window["blubolt"].selectZoomImage = (imagePosition: number) => {
      const thumbnail = productForm.querySelector(
        `[data-product-thumbnail-index="${imagePosition}"]`,
      );
      if (!thumbnail) {
        console.error("could not find the image selected", imagePosition);
        return;
      }
      onProductThumbnailClick(thumbnail)();
    };

    ["load", "resize"].forEach(function (e) {
      window.addEventListener(e, () => {
        setTimeout(() => {
          const imagesCarousel = productForm.querySelector(
            ".product-media-images .swiper",
          ) as HTMLElement;
          if (imagesCarousel) {
            const imagesFirstSlide = imagesCarousel.querySelector(
              ".swiper-slide",
            ) as HTMLElement;
            const thumbsCarousel = productForm.querySelector(
              ".product-media-thumbs .swiper",
            ) as HTMLElement;
            if (imagesFirstSlide && thumbsCarousel) {
              thumbsCarousel.style.maxHeight = `${imagesFirstSlide.clientHeight}px`;
            }
          }
        }, 100);
      });
    });

    // Uncomment all of the functionality below if you want the PDP to de-select variants by default

    // const getQueryVariable = (variable: string) => {
    //   const query = window.location.search.substring(1);
    //   const vars = query.split('&');
    //   for (let i = 0; i < vars.length; i++) {
    //     const pair = vars[i].split('=');
    //     if (pair[0] === variable) {
    //       return pair[1];
    //     }
    //   }
    //   return (false);
    // }

    // const removePreselectedVariant = () => {
    //   // Removes checked radios
    //   const allVariantsOptions = productForm.querySelectorAll('[data-option-select]');
    //   if (allVariantsOptions.length > 1) {
    //     allVariantsOptions.forEach((el) => {
    //       el.removeAttribute('checked');
    //     })
    //     // Removes value from ID so nothing gets added to cart
    //     const atcId = productForm.querySelector('[name="id"]') as HTMLInputElement;
    //     atcId.removeAttribute('value');
    //     // Disables ATC button
    //     atcButton.setAttribute('disabled', 'disabled');
    //     atcButton.innerHTML = atcButton.getAttribute(opts.PRODUCT_UNAVAILABLE_TEXT_ATTR);
    //     // Dummy button in sticky ATC
    //     dummyAtcButton.setAttribute('disabled', 'disabled');
    //     dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(opts.PRODUCT_UNAVAILABLE_TEXT_ATTR);
    //     // Dummy select in sticky ATC
    //     dummySizeSelect.value = '';
    //   }
    // }

    // const pageVariantSelected = getQueryVariable('variant');

    // if (pageVariantSelected) {
    //   const variant = getVariantById(productData.variants, parseInt(pageVariantSelected))
    //   updateVariantData(variant)
    //   updateDummySelect();
    // } else {
    //   removePreselectedVariant();
    // }

    const highlightStockOptions = () => {
      const oosVariantList = [];
      const preOrderVariantsList = [];
      const lowStockVariantsList = [];
      productData.variants.forEach((variant) => {
        const variantQty = Number.parseInt(getVariantQty(variant));
        if (variantQty < lowStockLimit && variantQty > 0) {
          lowStockVariantsList.push(variant.title);
        }
        if (variant.selling_plan_allocations?.length && variantQty <= 0) {
          preOrderVariantsList.push(variant.title);
        }
        if (
          !variant.available ||
          (!variant.selling_plan_allocations?.length && variantQty <= 0)
        ) {
          oosVariantList.push(variant.title);
        }
      });
      const lowStockVariants = Array.from(optionFields).filter((option) =>
        lowStockVariantsList.includes(option.dataset.optionLabel),
      );
      const preOrderVariants = Array.from(optionFields).filter((option) =>
        preOrderVariantsList.includes(option.dataset.optionLabel),
      );
      const oosVariants = Array.from(optionFields).filter((option) =>
        oosVariantList.includes(option.dataset.optionLabel),
      );

      lowStockVariants.forEach((variant) =>
        variant.parentElement.classList.add(
          "variant-option__option--low-stock",
        ),
      );
      preOrderVariants.forEach((variant) =>
        variant.parentElement.classList.add(
          "variant-option__option--pre-order",
        ),
      );
      oosVariants.forEach((variant) =>
        variant.parentElement.classList.add("variant-option__option--oos"),
      );
    };

    highlightStockOptions();

    const initGiftCardRecipient = (): void => {
      const giftCardToggle = productForm.querySelector(
        "[data-gift-card-toggle]",
      ) as HTMLInputElement;
      const giftCardDetails = productForm.querySelector(
        "[data-gift-card-details]",
      ) as HTMLElement;
      if (!giftCardToggle || !giftCardDetails) return;
      const checkGiftCardRecipientStatus = () => {
        const giftCardEmail = productForm.querySelector(
          "[data-gift-card-email]",
        ) as HTMLInputElement;
        if (giftCardToggle.checked) {
          giftCardDetails.classList.remove("hide");
          giftCardEmail.setAttribute("required", "true");
        } else {
          giftCardDetails.classList.add("hide");
          productForm
            .querySelector("[data-gift-card-form]")
            .querySelectorAll(".text-input")
            .forEach((input) => {
              (input as HTMLInputElement).value = "";
              input.removeAttribute("required");
            });
        }
      };
      giftCardToggle.addEventListener("change", checkGiftCardRecipientStatus);
    };

    initGiftCardRecipient();
  });
};
