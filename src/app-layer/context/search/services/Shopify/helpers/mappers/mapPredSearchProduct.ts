import standardisePrice from '../../../../../../util/standardisePrice';
import {
  ISearchAndFilterProduct,
  ISearchAndFilterProductPrice,
} from '../../../../types';
import { IPredSearchProduct } from '../../types';
import getProductPrice from '../getProductPrice';

const mapPredSearchProduct = (
  product: IPredSearchProduct,
): ISearchAndFilterProduct => {
  const priceObj: ISearchAndFilterProductPrice = getProductPrice(
    product.price,
    product.compare_at_price_max,
    product.price_min,
    product.price_max,
  );

  return {
    available: product.available,
    description: product.description,
    handle: product.handle,
    index: null,
    pageIndex: null,
    type: product.type,
    variants: null,
    id: product.id,
    name: product.title,
    url: product.url,
    images: [{ src: product.image }],
    price: standardisePrice(product.price),
    priceObj: priceObj,
  };
};

export default mapPredSearchProduct;
