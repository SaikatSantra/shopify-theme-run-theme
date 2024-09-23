import { OptionList, ProductVariant } from '../../../app-layer/util/typings';
import { arraysMatch } from '../../utils/data';

const getVariantFromVariantsAndOptions = (variants: ProductVariant[], options: OptionList) : ProductVariant => {
  const variant = variants.find((variant) => {
    return arraysMatch(variant.options, options)
  })
  return variant
}

export default getVariantFromVariantsAndOptions;