
import { getSizedImageUrl } from '../utils/image';
import safeJSONParse from '../utils/safeJsonParse';


export interface ISwatchDatum {
  title: string;
  colourHex?: string | null;
  image?: string | null
}

export interface IGlobalSwatchSettings {
  [key: string]: {
    colourHex: string | null;
    image: string | null;
    title: string;
  }
}

export const getSwatches = (): IGlobalSwatchSettings => {
  const swatchDataEl = document.getElementById('swatchData')
  if (!swatchDataEl) {
    return {} as IGlobalSwatchSettings
  }
  const swatchData = safeJSONParse(swatchDataEl.textContent, []) as ISwatchDatum[]
  const swatchObject = swatchData.reduce((acca, swatch) => {
    return {
      ...acca,
      [swatch.title]: {
        colourHex: swatch.colourHex,
        image: swatch.image ? getSizedImageUrl(swatch.image, '50x50') : null,
        title: swatch.title
      }
    }
  }, {} as IGlobalSwatchSettings)

  return Object.keys(swatchObject).length > 0 ? swatchObject : {}
}

export const popuplateSwatches = (swatches: IGlobalSwatchSettings, container: HTMLElement | Document = document): void => {

  if (!swatches || typeof(swatches) !== 'object' || Object.keys(swatches).length < 1) {
    console.info('No global swatches')
    return
  }
  
  const swatchEls = container.querySelectorAll('[data-product-swatch]')
  if (!swatchEls || swatchEls.length < 1) {
    return
  }
  swatchEls.forEach((el: HTMLSpanElement) => {
    const swatchKey = el.dataset.productSwatch;
    try {
      const { image, colourHex, title } = swatches[swatchKey]
      if (image) {
        el.innerHTML = `<img width="80" height="80" alt="${title}" src="${image}">`
      } else if (colourHex) {
        el.style.backgroundColor = colourHex;
      }
    } catch (e) {
      console.info('Check the swatches setup, error logged below.')
      console.info(e)
    }
  })
}
