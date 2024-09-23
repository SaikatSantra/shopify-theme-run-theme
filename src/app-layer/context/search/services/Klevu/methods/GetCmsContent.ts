import KlevuApi from '../api';
import {
  ISearchProviderConfig,
  IGetCmsContentResult,
} from '../../../types';

const HandleSearch = (term: string, config: ISearchProviderConfig): Promise<IGetCmsContentResult> => (new Promise<IGetCmsContentResult>((resolve) => {

  const requestIds = {
    collections: 'SEARCH_COLLECTIONS',
    products: 'SEARCH_PRODUCTS',
    pages: 'SEARCH_PAGES',
  }

  const response: IGetCmsContentResult = {
    raw: null,
    pages: [],
    articles: [],
  }

  try {

    KlevuApi(config.apiKey, config.apiEndpoint).request({
      recordQueries: [
        {
          id: requestIds.pages,
          typeOfRequest: 'SEARCH',
          settings: {
            limit: config.qsPagesLimit,
            query: {
              term: term
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

      // @todo

      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default HandleSearch