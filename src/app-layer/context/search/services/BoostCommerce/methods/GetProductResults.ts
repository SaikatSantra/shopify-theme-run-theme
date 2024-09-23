import BoostCommerceApi from '../api';
import {
  IActiveCollection, IGetProductsResultsQuery,
  IGetProductsResult,
  ISearchFilter,
  ISearchProviderConfig
} from '../../../types';
import mapFilters from '../helpers/mapFilters';
import sortMap from '../helpers/sortMap';
import mapProduct from '../helpers/mappers/mapProduct';

const GetProductResults = (searchFilters: ISearchFilter[], activeCollection: IActiveCollection, query: IGetProductsResultsQuery, config: ISearchProviderConfig): Promise<IGetProductsResult> => (new Promise<IGetProductsResult>((resolve) => {

  const response: IGetProductsResult = {
    records: 0,
    total: 0,
    raw: null,
    products: [],
    filters: []
  }

  const pageIndex = query.pageIndex || 1;
  const limit = config.rProductsPerPage;

  try {

    const params = {
      q: query.term ?? '',
      // event_type: 'filter',
      collection_scope: activeCollection.id ?? 0,
      build_filter_tree: searchFilters.length > 0,
      pf_r_review_ratings_show_exact_rating: true,
      limit: limit,
      page: pageIndex,
      ...config.marketsEnabled ? {
        country: window['Shopify'].country.toLowerCase(),
        currency: window['Shopify'].currency.active.toLowerCase(),
      } : {},
      ...query.sortKey && sortMap[query.sortKey] ? {
        sort: sortMap[query.sortKey],
      } : {},
    }

    // set filters
    searchFilters.forEach((filter) => {

      filter.options.forEach((option) => {

        if (['MULTI_OPTION', 'SINGLE_OPTION'].includes(filter.type)) {
          if (!option.selected) return

          if (!params[filter.identifier]) params[filter.identifier] = []

          params[filter.identifier].push(option.identifier)
        } else if (filter.type === 'RANGE') {

          if (!params[filter.identifier]) params[filter.identifier] = []

          params[filter.identifier].push(`${option.selectedMinimum}:${option.selectedMaximum}`)
        } else {
          throw new Error('Filter type not implemented');
        }
      })
    })

    BoostCommerceApi(config.apiKey, config.apiEndpoint).request(window['theme'].template === 'search' ? 'search' : 'filter', params).then((res) => {

      // Early resolve if we have no results
      if (typeof res.data === 'undefined') {
        resolve(response)
      }

      response.total = res.data.total_product
      response.records = res.data.products.length

      // Map filters for updates
      if (typeof res.data.filter !== 'undefined') {
        response.filters = mapFilters(res)
      }

      // Map products

      response.products = res.data.products.map((product, index: number) => mapProduct(product, index, pageIndex));

      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default GetProductResults