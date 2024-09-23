import { ProductVariant } from "../../../app-layer/util/typings";

const getVariantImagePosition = (variant: ProductVariant) =>
  variant.featured_image ? variant.featured_image.position : -1;

export default getVariantImagePosition;
