import { ProductVariant } from "../../../app-layer/util/typings";

const updateVariantFormField =
  (formField: HTMLInputElement, productHandle: string) =>
  (variant: ProductVariant): void => {
    const btn = document.querySelector(
      `[data-product-form="${productHandle}"] [data-product-form-submit]`,
    ) as HTMLButtonElement;
    if (btn) {
      btn.dataset.atcProductId = variant.id.toString();
    }
    formField.value = variant.id.toString();
  };
export default updateVariantFormField;
