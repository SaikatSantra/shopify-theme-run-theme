import axios from 'axios';
import { Product } from '../../../app-layer/util/typings';
import getCurrencyRoute from '../../utils/getCurrencyRoute';

const axiosGetFullProductJSON = async (
  handle: string,
): Promise<Product | void> => {
  let jsonProductUrl = `products/${handle}.js`;
  if (window.location.pathname.indexOf('products_preview') !== -1) {
    jsonProductUrl = `${window.location.pathname}.js${window.location.search}`;
  }

  try {
    const { data } = await axios.get(getCurrencyRoute(jsonProductUrl));
    return data;
  } catch (e) {
    console.info(e);
  }
};

export default axiosGetFullProductJSON;
