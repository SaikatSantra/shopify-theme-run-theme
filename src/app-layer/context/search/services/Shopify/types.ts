import { ISearchAndFilterProductImage, ISearchAndFilterProductMetafield, ISearchAndFilterVariant } from '../../types';

// Template

export interface IFilterValueResponse {
  active: boolean;
  count: number;
  label: string;
  id: string;
  value: string;
}

export interface IFilterResponse {
  label: string;
  maxValue: number;
  minValue: number;
  id: string;
  rangeMax: number;
  rangeMin: number;
  type: string;
  values: IFilterValueResponse[];
  presentation: string;
}

export interface ITemplatePageResponse {
  id: number;
  title: string;
  handle: string;
  url: string;
}

export interface ITemplateArticleResponse {
  id: number;
  title: string;
  handle: string;
  url: string;
}

export type ISearchResultType = 'product' | 'page' | 'article';

export interface ITemplateProductResponse {
  id: number;
  handle: string;
  title: string;
  tags: string[];
  available: boolean;
  url: string;
  type: string;
  description: string;
  images: ISearchAndFilterProductImage[];
  variants: ISearchAndFilterVariant[];
  price: number;
  priceMin: number;
  priceMax: number;
  compareAtPriceMax: number;
  metafields: ISearchAndFilterProductMetafield[];
  resultType: ISearchResultType;
}

export interface ICollTemplateResponse {
  resultsCount: number;
  products: ITemplateProductResponse[];
  filters: IFilterResponse[];
}

type CombinedSearchResults = ITemplateProductResponse & ITemplatePageResponse & ITemplateArticleResponse;

export interface ISearchTemplateResponse {
  resultsCount: number;
  searchResults: CombinedSearchResults[];
  filters: IFilterResponse[];
}

// Predictive Search

export interface IPredSearchCollection {
  id: number;
  title: string;
  handle: string;
  url: string;
}

export interface IPredSearchPage {
  id: number;
  title: string;
  handle: string;
  url: string;
}

export interface IPredSearchProduct {
  id: number;
  title: string;
  handle: string;
  url: string;
  image: string;
  available: boolean;
  description: string;
  type: string;
  price_min: string;
  price_max: string;
  compare_at_price_min: string;
  compare_at_price_max: string;
  price: string;
}

export interface IPredSearchArticle {
  id: number;
  title: string;
  handle: string;
  url: string;
}

export interface IPredSearchQuery {
  text: string;
  url: string;
}

export interface IPredSearchResponse {
  resources: {
    results: {
      collections: IPredSearchCollection[];
      pages: IPredSearchPage[];
      products: IPredSearchProduct[];
      articles: IPredSearchArticle[];
      queries: IPredSearchQuery[];
    };
  };
}
