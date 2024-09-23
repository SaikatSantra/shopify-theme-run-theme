import { OptionList, ProductVariant } from "../../../app-layer/util/typings";

export interface OptionsMap {
  imagePosition: number;
  options: OptionList;
  id: number;
}

const mapOptionsByImageIndex = (variants: ProductVariant[]): OptionsMap[] => {
  const variantsWithImages = variants.filter(
    (variant) => variant.featured_image && variant.featured_image.position,
  );
  return variantsWithImages.map((variant) => ({
    imagePosition: variant.featured_image.position,
    options: variant.options,
    id: variant.id,
  }));
};

export default mapOptionsByImageIndex;
