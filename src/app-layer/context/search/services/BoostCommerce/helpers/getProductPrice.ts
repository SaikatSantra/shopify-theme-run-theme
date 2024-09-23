import standardisePrice from '../../../../../util/standardisePrice';
import { ISearchAndFilterProductPrice } from '../../../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getProductPrice = (product): ISearchAndFilterProductPrice => {
  const activeCurrency = window['theme'].activeCurrency?.toLowerCase() || '';

  const priceMin = standardisePrice(product[`price_min_${activeCurrency}`] ?? product.price_min);
  const priceMax = standardisePrice(product[`price_max_${activeCurrency}`] ?? product.price_max);

  let comparePriceMax = 0;

  if (product.compare_at_price_max) {
    comparePriceMax = standardisePrice(
      product[`compare_at_price_max_${activeCurrency}`] ?? product.compare_at_price_max
    );
  }

  // In my experience this doesn't work (returns undefined)
  // const originalPrice =
  //   priceMax > comparePriceMax
  //     ? priceMax
  //     : comparePriceMax
  //       ? standardisePrice(product[`price_max_${activeCurrency}`])
  //       : product.compare_at_price_max
  //         ? standardisePrice(product.compare_at_price_max)
  //         : priceMax;


  const originalPrice = priceMax > comparePriceMax ? priceMax : comparePriceMax


  return <ISearchAndFilterProductPrice>{
    priceMin,
    priceMax,
    finalPrice: priceMax,
    originalPrice
  };
};

export default getProductPrice;
