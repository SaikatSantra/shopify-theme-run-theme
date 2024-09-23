import { ISearchFilter } from '../../../types';

// Populate URL parameters with all the applied filters.
// https://shopify.dev/docs/themes/navigation-search/filtering/storefront-filtering

const getFilteredUrlParams = (searchFilters: ISearchFilter[]): string => {
  let urlParams = '';

  searchFilters.forEach((filter: ISearchFilter) => {
    filter.options.forEach(option => {
      if (['MULTI_OPTION', 'SINGLE_OPTION'].includes(filter.type)) {
        if (!option.selected) return;

        // Shopify needs to use the option value rather than label
        let filterValue: string = encodeURIComponent(option.value ? option.value : option.label);

        // The availability filter uses '1' or '0' as it's value instead of its label.

        if (option.identifier === 'In stock') filterValue = '1';
        if (option.identifier === 'Out of stock') filterValue = '0';

        urlParams += `&${filter.identifier}=${filterValue}`;
      } else if (filter.type === 'RANGE') {
        urlParams += `&${filter.identifier}.gte=${option.selectedMinimum}`;
        urlParams += `&${filter.identifier}.lte=${option.selectedMaximum}`;
      }
    });
  });

  return urlParams;
};

export default getFilteredUrlParams;
