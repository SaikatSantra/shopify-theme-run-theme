import getRoute from '../../../../../../../scripts/utils/getRoute';
import { ISearchAndFilterProduct } from '../../../../types';
import { ITemplateProductResponse } from '../../types';
import getNativePrice from '../getNativePrice';
import getProductPrice from '../getProductPrice';

const mapProduct = (product: ITemplateProductResponse, index: number, pageIndex?: number): ISearchAndFilterProduct => {
  // Boost returns pricing more in line with Shopify data
  // so we have this getNativePrice function to use that
  const nativePriceObj = getNativePrice(product);
  // We also have the baseline way, which needs updating
  // as it uses completely arbitrary naming conventions
  const priceObj = getProductPrice(product);

  return {
    id: product.id,
    pageIndex: pageIndex,
    index: index,
    name: product.title,
    handle: product.handle,
    tags: product.tags,
    available: product.available,
    metafields: product.metafields,
    url: `${getRoute()}products/${product.handle}`,
    images: product.images_info,
    price: nativePriceObj.price,
    price_min: nativePriceObj.price_min,
    price_max: nativePriceObj.price_max,
    price_varies: nativePriceObj.price_varies,
    compare_at_price: nativePriceObj.compare_at_price,
    compare_at_price_min: nativePriceObj.compare_at_price_min,
    compare_at_price_max: nativePriceObj.compare_at_price_max,
    compare_at_price_varies: nativePriceObj.compare_at_price_varies,
    priceObj: priceObj,
    variants: product.variants,
    meta: null,
    type: product.product_type,
    description: product.body_html,
  }
};

export default mapProduct;
