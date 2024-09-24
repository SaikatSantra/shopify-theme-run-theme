import {
  ISearchAndFilterProduct,
  ISearchAndFilterProductPrice,
} from '../../../../types';
import { ITemplateProductResponse } from '../../types';
import getProductPrice from '../getProductPrice';

const mapProduct = (
  product: ITemplateProductResponse,
  index: number,
  pageIndex: number,
): ISearchAndFilterProduct => {
  const priceObj: ISearchAndFilterProductPrice = getProductPrice(
    product.price / 100,
    product.compareAtPriceMax / 100,
    product.priceMin / 100,
    product.priceMax / 100,
  );

  // It doesn't seem to be possible to get every Metafield of a product in Liquid or the Storefront API.
  // They need to be explicitly called in the template for every namespace separately at the moment.

  return {
    id: product.id,
    pageIndex: pageIndex,
    index: index,
    name: product.title,
    handle: product.handle,
    tags: product.tags,
    available: product.available,
    url: product.url,
    type: product.type,
    description: product.description,
    meta: null,
    images: product.images,
    price: product.price,
    price_min: product.priceMin,
    price_max: product.priceMax,
    price_varies: product.priceMin === product.priceMax ? false : true,
    compare_at_price_max: product.compareAtPriceMax,
    priceObj: priceObj,
    metafields: product.metafields,
    variants: product.variants,
  };
};

export default mapProduct;
