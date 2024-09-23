import { IExtender } from '.';

import { IGlobalSwatchSettings } from '../../../../scripts/global/swatches';
import { ISwatch } from '../types'

import getRoute from '../../../../scripts/utils/getRoute';

const getProductSwatchesFromTags = (globalSwatchSettings: IGlobalSwatchSettings, tags: string[]): ISwatch[] => {
  if (!tags || tags.length < 1) return []
  return tags.flatMap(tag => {
    const tagSplit = tag.split('::');
    if (tagSplit[0] !== 'swatch') return [];
    const swatchSettings = globalSwatchSettings[tagSplit[1]];
    if (!swatchSettings) return [];
    return {
      ...swatchSettings,
      link: `${getRoute()}products/${tagSplit[2]}`,
    }
  })
}

const withSwatches: IExtender = {
  // init: () => {}
  // We don't have a init here, swatches are loaded into the window by the global JS
  // as they are needed across the site ouside of the search / filter context
  // eg, on a "you may also like" on a pdp
  extendGetProductsResult: (results) => {
    const updatedProducts = results.products.map(product => {
      const productSwatches = getProductSwatchesFromTags(
        window['blubolt'].swatches,
        product.tags
      )
      return {
        ...product,
        meta: {
          ...product.meta,
          swatches: productSwatches
        }
      }
    })
    return {
      ...results,
      products: updatedProducts
    }
    
  }
}

export default withSwatches
