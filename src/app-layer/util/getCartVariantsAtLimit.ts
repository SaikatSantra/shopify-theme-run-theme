import getRoute from '../../scripts/utils/getRoute';

const getCartVariantsAtLimit = async (): Promise<{ [key: string]: number }> => {
  try {
    const route = getRoute();
    let currencyQuery = '';
    if (route !== '/') {
      // getting odd redirect pattern happening without confirming currency
      // within url here
      currencyQuery = `&currency=${window.Shopify.currency.active}`;
    }
    const res = await fetch(
      `${getRoute()}cart?view=stock-check${currencyQuery}`,
    );
    const ret = await res.json();
    return ret;
  } catch (e) {
    console.info(e);
    return {};
  }
};
export default getCartVariantsAtLimit;
