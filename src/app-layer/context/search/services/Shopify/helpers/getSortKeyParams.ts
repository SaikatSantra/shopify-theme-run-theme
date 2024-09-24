import sortMap from '../../Shopify/helpers/sortMap';
import { IGetProductsResultsQuery } from '../../../types';

// Set the sorting values that are sent over the request in sortMap.ts.
// The values that are displayed on the front end are in shopify-sort-by-lang-strings-json.liquid.

const getSortKeyParams = (query: IGetProductsResultsQuery): string => {
  if (query.sortKey && sortMap[query.sortKey]) {
    return `&sort_by=${sortMap[query.sortKey]}`;
  }

  return '';
};

export default getSortKeyParams;
