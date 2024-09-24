import standardisePrice from '../../../../../util/standardisePrice';
import { ISearchAndFilterProductPrice } from '../../../types';

const getProductPrice = (
  price: number | string,
  compareAtMax: number | string,
  priceMin: number | string,
  priceMax: number | string,
): ISearchAndFilterProductPrice => {
  const finalPrice: number = standardisePrice(price);

  let originalPrice: number = standardisePrice(compareAtMax);

  if (originalPrice < 1) {
    originalPrice = finalPrice;
  }

  return {
    originalPrice,
    finalPrice,
    priceMin: standardisePrice(priceMin),
    priceMax: standardisePrice(priceMax),
  };
};

export default getProductPrice;
