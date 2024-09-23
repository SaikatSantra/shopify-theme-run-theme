import BoostCommerceApi from '../api';
import {
  IActiveCollection,
  IGetFiltersResult,
  ISearchProviderConfig,
} from '../../../types';
import mapFilters from '../helpers/mapFilters';

const GetFilters = (activeCollection: IActiveCollection, searchTerm: string|null, config: ISearchProviderConfig): Promise<IGetFiltersResult> => (new Promise<IGetFiltersResult>((resolve) => {

  const response: IGetFiltersResult = {
    raw: null,
    filters: []
  }

  try {

    const filterParams: any = {
      q: searchTerm ?? '',
      build_filter_tree: true,
      pf_r_review_ratings_show_exact_rating: true,
      collection_scope: activeCollection.id ?? 0,
      // if markets are enabled pass country/currency
      ...config.marketsEnabled ? {
        country: window['Shopify'].country.toLowerCase(),
        currency: window['Shopify'].currency.active.toLowerCase(),
      } : {},
    }

    BoostCommerceApi(config.apiKey, config.apiEndpoint).request(window['theme'].template === 'search' ? 'search' : 'filter', filterParams).then((res) => {
      // Early resolve if we have no results
      if (typeof res.data === 'undefined' || res.data.filter.options.length === 0) {
        resolve(response)
      }

      //response is OK but no products are being returned
      if (res.status === 200 && !res.data?.products?.length) {
        throw new Error('check your Boost setup, no filterable products are being passed back from Boost ')
      }

      response.filters = mapFilters(res)

      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default GetFilters