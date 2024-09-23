
/**
 * Store Configuration
 */
export interface IActiveCollection {
  id: string,
  title: string,
  handle: string
}

/**
 * Search Interfaces
 */
export interface IQuickSearchResultTypo {
  value: string
}

export interface IQuickSearchResultContent {
  id: string,
  type: string,
  data: any // @todo ... this could quite literally be anything. not sure we can aggregate and may need to leave it up to provider specific rendering ... we shall see
}

export interface IQuickSearchResultSuggestion {
  value: string,
  query: string
}

export interface ISearchAndFilterNativeProductPrice {
  price: number,
  price_min: number,
  price_max: number,
  price_varies: boolean,
  compare_at_price?: number,
  compare_at_price_min?: number,
  compare_at_price_max?: number,
  compare_at_price_varies?: boolean,
}

export interface ISearchAndFilterProductPrice {
  originalPrice: number,
  finalPrice: number,
  priceMin: number,
  priceMax: number
}
export interface ISticker {
  backgroundColor: string,
  textColor: string,
  title: string
}
export interface IKeyedStickers {
  [key: string]: ISticker
}

export interface ISwatch {
  color?: string;
  colors?: string[];
  pattern?: string;
  url?: string;
  title: string;
  active?: boolean;
}

interface ISearchAndFilterProductMetafield {
  key: string,
  namespace: string,
  value: string,
}

export interface ISearchAndFilterProductMeta {
  stickers?: ISticker[]
  swatches?: ISwatch[]
}

export interface ISearchAndFilterProductImage {
  src: string,
  position?: number | null,
  alt?: string | null,
  width?: number | null,
  height?: number | null,
  media_type?: string | null,
}

export interface ISearchAndFilterProductVariant {
  id: string
}

export interface ISearchAndFilterProduct {
  id: number,
  pageIndex?: number,
  index: number,
  name: string,
  handle: string,
  tags?: string[],
  available: boolean,
  metafields?: ISearchAndFilterProductMetafield[],
  url: string,
  media?: ISearchAndFilterProductImage[],
  images: ISearchAndFilterProductImage[],
  priceObj: ISearchAndFilterProductPrice,
  price: number,
  price_min?: number,
  price_max?: number,
  price_varies?: boolean,
  compare_at_price?: number,
  compare_at_price_min?: number,
  compare_at_price_max?: number,
  compare_at_price_varies?: boolean,
  variants: ISearchAndFilterVariant[]
  meta?: ISearchAndFilterProductMeta,
  type: string,
  description: string,
}

export interface ISearchAndFilterVariant {
  available: string,
  barcode: string,
  compare_at_price: string,
  fulfillment_service: string,
  id: number,
  image: any,
  inventory_management: string,
  inventory_policy: string,
  inventory_quantity: number,
  merged_options: any,
  price: string,
  sku: string,
  title: string
}

export interface IQuickSearchResultPage {
  id: string,
  title: string,
  handle: string,
  url: string
}

export interface IQuickSearchResultArticle {
  id: string,
  title: string,
  handle: string,
  url: string
}

export interface IQuickSearchResultCollection {
  id: string,
  title: string,
  handle: string,
  url: string
}

export interface ISearchResultPage {
  id: string,
  title: string,
  handle: string,
  url: string
}

export interface ISearchResultArticle {
  id: string,
  title: string,
  handle: string,
  url: string
}

export interface IGetCmsContentResult {
  raw?: any,
  pages: ISearchResultPage[],
  articles: ISearchResultArticle[]
}

export interface IHandleQuickSearchResult {
  raw?: any,
  typos: IQuickSearchResultTypo[],
  suggestions: IQuickSearchResultSuggestion[],
  products: ISearchAndFilterProduct[],
  collections: IQuickSearchResultCollection[],
  pages: IQuickSearchResultPage[],
  articles: IQuickSearchResultArticle[]
}

export interface ISearchFilterOption {
  identifier: string,
  label: string,
  value?: string,
  selected: boolean,
  active: boolean,
  records: number | null,
}

export interface ISearchFilterRangeOption {
  minimum: number,
  maximum: number,
  selectedMinimum: number,
  selectedMaximum: number,
  activeMinimum: number,
  activeMaximum: number,
  selected: boolean
}

export type ISearchFilter = ISearchFilterRange | ISearchFilterStandard

export interface ISearchFilterRange {
  identifier: string,
  initiallyOpen: boolean,
  open: boolean,
  label: string,
  type: 'RANGE',
  displayType: 'RANGE',
  options: ISearchFilterRangeOption[],
  raw: any,
  presentation?: any,
}
export interface ISearchFilterStandard {
  identifier: string,
  initiallyOpen: boolean,
  open: boolean,
  label: string,
  type: 'MULTI_OPTION' | 'SINGLE_OPTION' | 'CUSTOM',
  displayType: 'TEXT' | 'SWATCH' | 'RATING' | 'BOX',
  options: ISearchFilterOption[],
  raw: any,
  presentation?: any,
}
export interface IGetFiltersResult {
  raw?: any,
  filters: ISearchFilter[]
}

export interface IGetProductsResult {
  raw?: any,
  records: number,
  total: number,
  products: ISearchAndFilterProduct[],
  filters: ISearchFilter[]
}

/**
 * Service Provider Interfaces
 */
export interface ISearchProviderConfig {
  apiKey: string,
  apiEndpoint: string,
  marketsEnabled: boolean,
  qsSuggestionsLimit: string,
  qsProductsLimit: string,
  qsCollectionLimit: string,
  qsPagesLimit: string,
  qsArticlesLimit: string,
  suggestionsIncludeUnavailable: boolean,
  rLoadMoreMode: 'paginate' | 'infinite' | 'loadMore',
  searchFilterDummyTag: string,
  rProductsPerPage: number,
  swatchDataPage: string,
  swatchPrefix: string,
  custom: any
}

export interface IGetProductsResultsQuery {
  term: string | null,
  pageIndex: number | null,
  sortKey: string
}

export interface IHandleSearch {
  (searchTerm: string, config?: ISearchProviderConfig): Promise<IHandleQuickSearchResult>
}

export interface IGetFilters {
  (activeCollection: IActiveCollection, searchTerm: string | null, config?: ISearchProviderConfig): Promise<IGetFiltersResult>
}

export interface IGetProductResults {
  (filters: ISearchFilter[], activeCollection: IActiveCollection, query: IGetProductsResultsQuery, config?: ISearchProviderConfig): Promise<IGetProductsResult>
}

export interface IGetCmsContent {
  (term: string, config?: ISearchProviderConfig): Promise<IGetCmsContentResult>
}

export interface IGetSwatchData {
  (swatchData: any): ISwatch[]
}

export interface ISearchService {
  methods: {
    handleSearch: IHandleSearch,
    getFilters: IGetFilters,
    getProductResults: IGetProductResults,
    getCmsContent: IGetCmsContent,
    getSwatchData?: IGetSwatchData
  }
}