import { IGetCmsContentResult } from '../../../types';
import {
  ISearchTemplateResponse,
  ITemplateArticleResponse,
  ITemplatePageResponse,
} from '../types';
import getTemplateJSON from '../../../../../../scripts/utils/getTemplateJSON';
import mapPage from '../helpers/mappers/mapPage';
import mapArticle from '../helpers/mappers/mapArticle';

const GetCmsContent = async (term: string): Promise<IGetCmsContentResult> => {
  const response: IGetCmsContentResult = {
    raw: null,
    pages: [],
    articles: [],
  };

  try {
    const res = await getTemplateJSON<ISearchTemplateResponse>(
      'search',
      '',
      'sf-data',
      `&q=${term}&type=article,page`,
    );

    // This is needed because the different type of results are returned together.
    const pages: ITemplatePageResponse[] = res.searchResults.filter(
      (result) => result.resultType === 'page',
    );
    const articles: ITemplateArticleResponse[] = res.searchResults.filter(
      (result) => result.resultType === 'article',
    );

    response.pages = pages.map((page) => mapPage(page));
    response.articles = articles.map((article) => mapArticle(article));

    return response;
  } catch (e) {
    throw new Error(`Error when getting Shopify CmsContent results: ${e}`);
  }
};

export default GetCmsContent;
