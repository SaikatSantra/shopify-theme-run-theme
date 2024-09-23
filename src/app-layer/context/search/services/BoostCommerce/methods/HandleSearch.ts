import {
  IHandleQuickSearchResult,
  ISearchProviderConfig,
  IQuickSearchResultCollection, IQuickSearchResultPage,
  IQuickSearchResultSuggestion,
  IQuickSearchResultArticle
} from '../../../types';
import BoostCommerceApi from '../api';
import getRoute from '../../../../../../scripts/utils/getRoute'
import mapProduct from '../helpers/mappers/mapProduct';


const HandleSearch = (searchTerm: string, config: ISearchProviderConfig): Promise<IHandleQuickSearchResult> => (new Promise<IHandleQuickSearchResult>((resolve) => {

  const response: IHandleQuickSearchResult = {
    raw: null,
    typos: [],
    products: [],
    collections: [],
    suggestions: [],
    pages: [],
    articles: [],
  }

  try {

    BoostCommerceApi(config.apiKey, config.apiEndpoint).request('search/suggest', {
      q: searchTerm,
      suggestion_limit: config.qsSuggestionsLimit,
      product_limit: config.qsProductsLimit,
      collection_limit: config.qsCollectionLimit,
      page_limit: config.qsPagesLimit,
    }).then((res) => {
      // Early resolve if we have no results
      if (typeof res.data === 'undefined' || res.data.all_empty === true) {
        resolve(response)
      }

      // Map collections
      response.collections = res.data.collections.map((collection) => {
        return <IQuickSearchResultCollection>{
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          url: `${getRoute()}collections/${collection.handle}`
        }
      })

      // Map products
      response.products = res.data.products.map((product, index: number) => mapProduct(product, index));

      // map suggestions
      response.suggestions = res.data.suggestions.map((suggestion) => {
        return <IQuickSearchResultSuggestion>{
          value: suggestion,
          query: suggestion.replace(/(<([^>]+)>)/gi, '').replace(/ /g, '+')
        }
      })

      /// map pages
      response.pages = res.data.pages.filter((page) => {
        return page.url.includes('/pages/')
      }).map((page) => {
        return <IQuickSearchResultPage>{
          id: page.id,
          handle: page.handle,
          title: page.title,
          url: `${getRoute()}pages/${page.handle}`,
        }
      })

      // map articles
      response.articles = res.data.pages.filter((article) => {
        return !article.url.includes('/pages/')
      }).map((article) => {
        return <IQuickSearchResultArticle>{
          id: article.id,
          handle: article.handle,
          title: article.title,
          url: `${getRoute()}${article.url.replace('/blogs/', 'blogs/')}`
        }
      })
      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default HandleSearch