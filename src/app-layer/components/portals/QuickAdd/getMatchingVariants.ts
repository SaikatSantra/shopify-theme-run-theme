import { ProductVariant } from '../../../util/typings';

const getMatchingVariants = (
  options: string[],
  variants: ProductVariant[],
): ProductVariant[] => {
  return variants.filter((variant) =>
    variant.options.every(
      (variantOption, i) => !options[i] || variantOption === options[i],
    ),
  );
};

export default getMatchingVariants;
