import {
  IGetCmsContentResult,
  ISearchProviderConfig,
  IQuickSearchResultArticle,
  IQuickSearchResultPage,
} from '../../../types';
import BoostCommerceApi from '../api';

const GetCmsContent = (term: string, config: ISearchProviderConfig): Promise<IGetCmsContentResult> => (new Promise<IGetCmsContentResult>((resolve) => {

  const response: IGetCmsContentResult = {
    raw: null,
    pages: [],
    articles: [],
  }

  try {

    BoostCommerceApi(config.apiKey, config.apiEndpoint).request('search/suggest', {
      suggest_types: [
        'pages',
        'suggestions'
      ],
      q: term,
    }).then((res) => {

      // Early resolve if we have no results
      if (typeof res.data === 'undefined' || res.data.all_empty === true) {
        resolve(response)
      }

      response.raw = res.data

      // map pages
      response.pages = res.data.pages.filter((page) => {
        return page.url.includes('/pages/')
      }).map((page) => {
        return <IQuickSearchResultPage>{
          id: page.id,
          handle: page.handle,
          title: page.title,
          url: page.url
        }
      })

      // map articles
      response.articles = res.data.pages.filter((page) => {
        return !page.url.includes('/pages/')
      }).map((page) => {
        return <IQuickSearchResultArticle>{
          id: page.id,
          handle: page.handle,
          title: page.title,
          url: page.url
        }
      })

      resolve(response)
    })
  } catch (e) {
    console.error(e)
    resolve(response)
  }
}))

export default GetCmsContent