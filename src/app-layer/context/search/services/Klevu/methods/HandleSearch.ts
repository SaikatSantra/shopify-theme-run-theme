import KlevuApi from '../api';
import {
  IHandleQuickSearchResult,
  ISearchProviderConfig, IQuickSearchResultCollection,
  ISearchAndFilterProduct, ISearchAndFilterProductImage, ISearchAndFilterProductPrice,
  IQuickSearchResultSuggestion, IQuickSearchResultTypo
} from '../../../types';
import standardisePrice from '../../../../../util/standardisePrice';
import handleFromUrl from '../../../../../util/handleFromUrl';

const HandleSearch = (searchTerm: string, config: ISearchProviderConfig): Promise<IHandleQuickSearchResult> => (new Promise<IHandleQuickSearchResult>((resolve) => {

  const requestIds = {
    collections: 'SEARCH_COLLECTIONS',
    products: 'SEARCH_PRODUCTS',
    pages: 'SEARCH_PAGES',
  }

  const response: IHandleQuickSearchResult = {
    raw: null,
    suggestions: [],
    typos: [],
    products: [],
    collections: [],
    pages: [],
    articles: [],
  }

  try {

    KlevuApi(config.apiKey, config.apiEndpoint).request({
      suggestions: [
        {
          id: 'SEARCH_SUGGESTIONS',
          typeOfQuery: 'AUTO_SUGGESTIONS',
          query: searchTerm,
          limit: config.qsSuggestionsLimit,
          hlStartElem: '<span class="suggestion-highlight">',
          hlEndElem: '</span>',
        }
      ],
      recordQueries: [
        {
          id: requestIds.products,
          typeOfRequest: 'SEARCH',
          settings: {
            limit: config.qsProductsLimit,
            query: {
              term: searchTerm
            },
            typeOfRecords: [
              'KLEVU_PRODUCT'
            ]
          },
        },
        {
          id: requestIds.collections,
          typeOfRequest: 'SEARCH',
          settings: {
            limit: config.qsCollectionLimit,
            query: {
              term: searchTerm
            },
            typeOfRecords: [
              'KLEVU_CATEGORY'
            ]
          },
        },
        {
          id: requestIds.pages,
          typeOfRequest: 'SEARCH',
          settings: {
            limit: config.qsPagesLimit,
            query: {
              term: searchTerm
            },
            typeOfRecords: [
              'KLEVU_CMS'
            ]
          },
        }
      ]
    }).then((res) => {

      // Set raw response
      response.raw = res.data

      // Map suggestions
      if (typeof res.data.suggestionResults !== 'undefined' && res.data.suggestionResults[0].suggestions.length > 0) {
        response.suggestions = res.data.suggestionResults[0].suggestions.map((suggestion) => {
          return <IQuickSearchResultSuggestion>{
            value: suggestion.suggest,
            query: suggestion.suggest.replace(/(<([^>]+)>)/gi, '').replace(/ /g, '+')
          }
        })

        
        // Set typo suggestion as first result from suggestions
        response.typos.push(<IQuickSearchResultTypo>{
          value: response.suggestions[0].value
        })
      }

      // Dynamically map other query types
      if (typeof res.data.queryResults !== 'undefined' && res.data.queryResults.length > 0) {
        res.data.queryResults.forEach((queryResult) => {
          switch (queryResult.id) {
            case requestIds.products:
              response.products = queryResult.records.map((record) => {
                return <ISearchAndFilterProduct>{
                  id: record.id,
                  name: record.name,
                  url: record.url,
                  images: [
                    <ISearchAndFilterProductImage>{
                      src: record.imageUrl.replace('_medium', '').split('?')[0] //gives us full size image
                    }
                  ],
                  price: <ISearchAndFilterProductPrice>{
                    originalPrice: standardisePrice(record.price),
                    finalPrice: standardisePrice(record.salePrice),
                    priceMin: record.startPrice === '' ? standardisePrice(record.price) : standardisePrice(record.startPrice),
                    priceMax: record.toPrice === '' ? standardisePrice(record.price) : standardisePrice(record.toPrice)
                  },
                  tags: record.tags ? record.tags.split(',').map((tag: string) => tag.trim()) : [],
                  handle: handleFromUrl(record.url),
                }
              })
              break
            case requestIds.collections:
              response.collections = queryResult.records.map((record) => {
                return <IQuickSearchResultCollection>{
                  id: record.id.replace('category_', ''),
                  title: record.name,
                  url: record.url
                }
              })
              break
            case requestIds.pages:
              // @todo This will need to be implemented if we intended on returning pages / articles for a client using Klevu. At the time of build we were not able to test this as our test store did not have any articles populated in Klevu. The logic required here is relatively simple, just depends on what we get back in the requests to Klevu
              // add page / article depending on category
              break;
          }
        })
      }

      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default HandleSearch
