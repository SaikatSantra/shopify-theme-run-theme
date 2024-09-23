import { ProductVariant } from "../../../app-layer/util/typings";
import { formatMoney } from "../../utils/currency";

const updatePrice =
  (
    priceEls: NodeListOf<Element>,
    compareAtPriceEls: NodeListOf<Element>,
    format: string,
  ) =>
  (variant: ProductVariant): void => {
    priceEls.forEach((priceEl) => {
      variant.compare_at_price && variant.compare_at_price > variant.price
        ? priceEl.classList.add("sale-price")
        : priceEl.classList.remove("sale-price");
      priceEl.innerHTML = formatMoney(variant.price, format);
    });
    compareAtPriceEls.forEach(
      (compareAtPriceEl) =>
        (compareAtPriceEl.innerHTML =
          variant.compare_at_price && variant.compare_at_price > variant.price
            ? formatMoney(variant.compare_at_price, format)
            : ""),
    );
  };

export default updatePrice;
