import { ProductVariant } from '../../../app-layer/util/typings'

const getVariantById = (variants: ProductVariant[], id: number) : ProductVariant | null => {
  return variants.find(variant => variant.id === id)
}

export default getVariantById