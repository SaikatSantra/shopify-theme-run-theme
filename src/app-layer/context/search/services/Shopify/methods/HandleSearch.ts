import { IHandleQuickSearchResult } from '../../../types';
import queryPredictiveSearchApi from '../../../../../../scripts/utils/queryPredictiveSearchApi';
import { IPredSearchResponse } from '../types';
import mapPage from '../helpers/mappers/mapPage';
import mapArticle from '../helpers/mappers/mapArticle';
import mapCollection from '../helpers/mappers/mapCollection';
import mapSuggestion from '../helpers/mappers/mapSuggestion';
import mapPredSearchProduct from '../helpers/mappers/mapPredSearchProduct';

const HandleSearch = async (searchTerm: string): Promise<IHandleQuickSearchResult> => {
  const mappedResponse: IHandleQuickSearchResult = {
    raw: null,
    typos: [],
    products: [],
    collections: [],
    suggestions: [],
    pages: [],
    articles: []
  };

  try {
    const res = await queryPredictiveSearchApi<IPredSearchResponse>(searchTerm);

    const { collections, products, queries, pages, articles } = res.resources.results;

    mappedResponse.collections = collections?.map(collection => mapCollection(collection));
    mappedResponse.pages = pages?.map(page => mapPage(page));
    mappedResponse.articles = articles?.map(article => mapArticle(article));
    mappedResponse.suggestions = queries?.map(query => mapSuggestion(query));
    mappedResponse.products = products?.map(product => mapPredSearchProduct(product));

    return mappedResponse;
  } catch (e) {
    throw new Error(`Error when getting Quick Search results: ${e}`);
  }
};

export default HandleSearch;
