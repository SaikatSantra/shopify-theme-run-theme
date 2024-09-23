import standardisePrice from '../../../../../util/standardisePrice';
import { ISearchAndFilterNativeProductPrice } from '../../../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getNativePrice = (product): ISearchAndFilterNativeProductPrice => {
  // Get the active currency
  const activeCurrency = window['theme'].activeCurrency?.toLowerCase() || '';

  // Return the min and max prices using the active currency if we're using markets
  const price_min = standardisePrice(product[`price_min_${activeCurrency}`] ?? product.price_min);
  const price_max = standardisePrice(product[`price_min_${activeCurrency}`] ?? product.price_min);
  // Compare the two prices
  const price_varies = price_min === price_max ? false : true

  // Return the min and max compare prices using the active currency if we're using markets, else return 0
  const compare_at_price_min = product.compare_at_price_min || `compare_at_price_min_${activeCurrency}` ? standardisePrice(product[`compare_at_price_min_${activeCurrency}`] ?? product.compare_at_price_min) : 0;
  const compare_at_price_max = product.compare_at_price_max || `compare_at_price_max_${activeCurrency}` ? standardisePrice(product[`compare_at_price_max_${activeCurrency}`] ?? product.compare_at_price_max) : 0;
  const compare_at_price_varies = compare_at_price_min === compare_at_price_max ? false : true

  // Now we have the values from above we can compare them and get the original pricing
  const price = price_max > compare_at_price_max ? price_max : compare_at_price_max;
  const compare_at_price = compare_at_price_max ? compare_at_price_max : 0;

  return <ISearchAndFilterNativeProductPrice>{
    price: price,
    price_min: price_min,
    price_max: price_max,
    price_varies: price_varies,
    compare_at_price: compare_at_price,
    compare_at_price_min: compare_at_price_min,
    compare_at_price_max: compare_at_price_max,
    compare_at_price_varies: compare_at_price_varies,
  };
};

export default getNativePrice;
