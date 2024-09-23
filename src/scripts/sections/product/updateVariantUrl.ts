import { ProductVariant } from '../../../app-layer/util/typings';

/**
 * takes variant, returns function that updates replaces window state
 *
 * @param variant
 */
const updateVariantUrl = (variant: ProductVariant): void => {
  const url = new URL(window.location.href)

  if (variant && url.searchParams.has('variant')) {
    url.searchParams.set('variant', variant.id.toString())
  } else if (variant && !url.searchParams.has('variant')) {
    url.searchParams.append('variant', variant.id.toString())
  } else {
    url.searchParams.delete('variant')
  }

  window.history.replaceState({ ...window.history.state }, '', url.toString())
}

export default updateVariantUrl;