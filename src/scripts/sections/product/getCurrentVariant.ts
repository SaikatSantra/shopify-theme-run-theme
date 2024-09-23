import { ProductVariant } from "../../../app-layer/util/typings";

const getCurrentVariant = (variants: ProductVariant[], variantIdFormField: HTMLInputElement) => {
  const id = parseInt(variantIdFormField.value)
  return variants.find(variant => variant.id === id)
}

export default getCurrentVariant;