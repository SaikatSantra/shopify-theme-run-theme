import { ProductVariant } from "../../../app-layer/util/typings";

const getVariantImageUrl = (variant: ProductVariant): string => {
  return variant.featured_image ? variant.featured_image.src : "";
};

export default getVariantImageUrl;
