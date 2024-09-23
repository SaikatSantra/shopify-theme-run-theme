import KlevuApi from '../api'
import {
  IActiveCollection,
  IGetProductsResultsQuery,
  IGetProductsResult,
  ISearchFilter,
  ISearchFilterOption,
  ISearchProviderConfig,
  ISearchAndFilterProduct,
  ISearchAndFilterProductImage,
  ISearchAndFilterProductPrice,
  ISearchFilterRangeOption,
} from '../../../types'
import standardisePrice from '../../../../../util/standardisePrice'
import mapFiltersFromResponse from '../helpers/mapFiltersFromResponse'
import handleFromUrl from '../../../../../util/handleFromUrl'
import sortMap from '../helpers/sortMap'

const GetProductResults = (
  searchFilters: ISearchFilter[],
  activeCollection: IActiveCollection,
  query: IGetProductsResultsQuery,
  config: ISearchProviderConfig
): Promise<IGetProductsResult> => (new Promise<IGetProductsResult>((resolve) => {

  const response: IGetProductsResult = {
    raw: null,
    records: 0,
    total: 0,
    products: [],
    filters: []
  }

  const getSearchTerm = (): string => {
    if (query.term) {
      return query.term
    }
    if (activeCollection.handle) {
      return activeCollection.handle
    }
    return ''
  }

  /**
   * Transform selected filters
   */
  const filters = searchFilters.map((filter) => {

    const transformedFilter = {
      key: null,
      values: [],
    }

    transformedFilter.key = filter.identifier

    if (['MULTI_OPTION', 'SINGLE_OPTION'].includes(filter.type)) {
      transformedFilter.values = (filter.options as ISearchFilterOption[]).map(option => {
        return option.selected ? option.identifier : false
      }).filter(value => value)
    } else if (filter.type === 'RANGE') {
      const option = filter.options[0] as ISearchFilterRangeOption
      transformedFilter.values = [option.selectedMinimum, option.selectedMaximum]
    } else {
      return false
    }

    return transformedFilter.values.length > 0 ? transformedFilter : false
  }).filter(filter => filter)

  try {
    KlevuApi(config.apiKey, config.apiEndpoint).request({
      recordQueries: [
        {
          id: 'SEARCH_PRODUCTS',
          typeOfRequest: 'SEARCH',
          settings: {
            limit: config.rProductsPerPage,
            offset: (query.pageIndex > 1) && config.rLoadMoreMode === 'loadMore' || config.rLoadMoreMode === 'paginate' || config.rLoadMoreMode === 'infinite' ? (query.pageIndex - 1) * config.rProductsPerPage : 0,
            query: {
              term: getSearchTerm()
            },
            ...query.sortKey && sortMap[query.sortKey] ? {
              sort: sortMap[query.sortKey],
            } : {},
            typeOfRecords: [
              'KLEVU_PRODUCT'
            ],
          },
          filters: {
            filtersToReturn: {
              enabled: true
            },
            applyFilters: {
              filters: filters
            },
          }
        }
      ]
    }).then((res) => {
      // Set raw response
      response.raw = res.data

      // Map filters
      if (typeof res.data.queryResults[0].filters !== 'undefined') {
        response.filters = mapFiltersFromResponse(res)
      }

      // Map products
      if (typeof res.data.queryResults !== 'undefined' && res.data.queryResults.length > 0) {

        response.records = res.data.queryResults[0].meta.noOfResults
        response.total = res.data.queryResults[0].meta.totalResultsFound

        response.products = res.data.queryResults[0].records.map((record, index) => {
          return <ISearchAndFilterProduct>{
            id: record.id,
            index: ((query.pageIndex - 1) * config.rProductsPerPage) + index,
            pageIndex: query.pageIndex,
            handle: handleFromUrl(record.url),
            name: record.name,
            url: record.url,
            images: [
              <ISearchAndFilterProductImage>{
                src: record.imageUrl.replace('_medium', '').split('?')[0] //gives us full size image
              }
            ],
            price: standardisePrice(record.price),
            price_min: record.startPrice === '' ? standardisePrice(record.price) : standardisePrice(record.startPrice),
            price_max: record.toPrice === '' ? standardisePrice(record.price) : standardisePrice(record.toPrice),
            price_varies: record.startPrice !== '' && record.toPrice !== '' && record.startPrice !== record.toPrice ? true : false,
            priceObj: <ISearchAndFilterProductPrice>{
              originalPrice: standardisePrice(record.price),
              finalPrice: standardisePrice(record.salePrice),
              priceMin: record.startPrice === '' ? standardisePrice(record.price) : standardisePrice(record.startPrice),
              priceMax: record.toPrice === '' ? standardisePrice(record.price) : standardisePrice(record.toPrice)
            },
            tags: record.tags ? record.tags.split(',').map((tag: string) => tag.trim()) : []
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

export default GetProductResults