import getRoute from './getRoute';

declare global {
  interface Window {
    Shopify: any;
  }
}

const getCurrencyRoute = (endPoint:string): string => {
  const route = getRoute();
  let currencyQuery = '';
  if (route !== '/') {
    // always append currency parameter 
    currencyQuery = `${endPoint.includes('?') ? '&' : '?' }currency=${window.Shopify.currency.active}`;
  }
  return `${route}${endPoint}${currencyQuery}`;
}

export default getCurrencyRoute