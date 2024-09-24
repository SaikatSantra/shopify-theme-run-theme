import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import SearchService from './SearchService';
import {
  IHandleQuickSearchResult,
  ISearchProviderConfig,
  IQuickSearchResultTypo,
  ISearchAndFilterProduct,
  IQuickSearchResultCollection,
  IQuickSearchResultSuggestion,
  IQuickSearchResultContent,
  ISearchFilter,
  ISearchFilterOption,
  IQuickSearchResultPage,
  IQuickSearchResultArticle,
  ISearchFilterRangeOption,
  IActiveCollection,
  IGetProductsResult,
  IGetCmsContentResult,
  ISwatch,
  ISearchFilterStandard,
  ISearchFilterRange,
} from './types';
import { useDebouncedCallback } from 'use-debounce';
import updateLocationQuery from './helpers/updateLocationQuery';
import getCurrentActiveFilters from './helpers/getCurrentActiveFilters';

import FILTER_SEARCH from './consts';

import getRoute from '../../../scripts/utils/getRoute';
import axios from 'axios';

export interface IFFetchContext {
  children: any;
  config: ISearchProviderConfig;
  activeCollection: IActiveCollection;
}

interface ContextValue {
  activeCollection: IActiveCollection;
  searchTerm: string;
  quickSearchTerm: string;
  setQuickSearchTerm: Dispatch<SetStateAction<string>>;
  sortKey: string;
  setSortKey: Dispatch<SetStateAction<string>>;
  pageIndex: number;
  isSearching: boolean;
  quickSearchResult: IHandleQuickSearchResult;
  quickSearchResultsTypos: IQuickSearchResultTypo[];
  quickSearchResultsProducts: ISearchAndFilterProduct[];
  quickSearchResultsCollections: IQuickSearchResultCollection[];
  quickSearchResultsPages: IQuickSearchResultPage[];
  quickSearchResultsArticles: IQuickSearchResultArticle[];
  quickSearchResultsSuggestions: IQuickSearchResultSuggestion[];
  quickSearchResultsContent: IQuickSearchResultContent[];
  searchFilters: ISearchFilter[];
  filtersLoading: boolean;
  newPageLoading: boolean;
  productSearchResult: IGetProductsResult;
  productSearchResultsState: IGetProductsResult[];
  cmsSearchResults: IGetCmsContentResult;
  filterSwatches: ISwatch[];
  pendingProductCount: number;
  inputEventHandlers: {
    handleSearchInputChange: any;
    handleSearchInputKeyPress: any;
    handleSearchSuggestionSelected: any;
    handleUpdateRangeOption: (
      filterIndex: number,
      optionIndex: number,
      selectedMinimum: number,
      selectedMaximum: number,
    ) => void;
    handleToggleMultiOption: (
      filterIndex: number,
      optionIndex: number,
      force?: boolean,
    ) => void;
    handleToggleSingleOption: (
      filterIndex: number,
      optionIndex: number,
      value: boolean,
    ) => void;
    handleUpdatePageIndex: (
      pageIndex: number,
      triggerFiltering: boolean,
      silent: boolean,
    ) => void;
    handleSortByChange: any;
    handleClearSpecificFilter: (filterIndex: number) => void;
    handleClearAllFilters: () => void;
    handleToggleFilterOpen: (filterIndex: number, value?: boolean) => void;
    handleApply: () => void;
  };
  config: ISearchProviderConfig;
  eventHandlers;
}

export const FILTER_QUERY_PARAM_PREFIX = 'filter_';
export const FILTER_QUERY_PARAM_SEPARATOR = ',';

export const SORT_TYPE_VALS = Object.values(FILTER_SEARCH.SORT_TYPES);

export const SearchContext: React.Context<ContextValue> = createContext(null);

export const SearchProvider: React.FC<IFFetchContext> = ({
  children,
  config,
  activeCollection,
}) => {
  // control
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // input
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quickSearchTerm, setQuickSearchTerm] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(null);

  // data
  const [quickSearchResult, setQuickSearchResult] =
    useState<IHandleQuickSearchResult>(null);
  const [quickSearchResultsTypos, setQuickSearchResultsTypos] =
    useState<IQuickSearchResultTypo[]>(null);
  const [quickSearchResultsProducts, setQuickSearchResultsProducts] =
    useState<ISearchAndFilterProduct[]>(null);
  const [quickSearchResultsCollections, setQuickSearchResultsCollections] =
    useState<IQuickSearchResultCollection[]>(null);
  const [quickSearchResultsSuggestions, setQuickSearchResultsSuggestions] =
    useState<IQuickSearchResultSuggestion[]>(null);
  const [quickSearchResultsContent, setQuickSearchResultsContent] =
    useState<IQuickSearchResultContent[]>(null);
  const [quickSearchResultsPages, setQuickSearchResultsPages] =
    useState<IQuickSearchResultPage[]>(null);
  const [quickSearchResultsArticles, setQuickSearchResultsArticles] =
    useState<IQuickSearchResultArticle[]>(null);

  const [filtersToUpdate, setFiltersToUpdate] = useState<
    {
      filterIndex: number;
      optionIndex: number;
    }[]
  >([]);

  const [searchFilters, setSearchFilters] = useState<ISearchFilter[]>(null);

  const [sortKey, setSortKey] = useState<string>(null);

  const [productSearchResult, setProductSearchResult] =
    useState<IGetProductsResult>(null);
  const [productSearchResultsState, setProductResultsState] = useState<
    IGetProductsResult[]
  >([]);

  const [cmsSearchResults, setCmsSearchResults] =
    useState<IGetCmsContentResult>(null);

  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);

  const [newPageLoading, setNewPageLoading] = useState<boolean>(false);

  const [filterSwatches, setFilterSwatches] = useState<ISwatch[]>([]);

  const [pendingProductCount, setPendingProductCount] = useState(
    null as null | number,
  );

  const updateFilters = (
    newFilters: ISearchFilter[],
    activate?: boolean,
  ): void => {
    const updatedFilters = searchFilters.map((filter) => {
      const newFilter = newFilters.find(
        ({ identifier }) => identifier === filter.identifier,
      );

      if (filter.type === FILTER_SEARCH.FILTER_TYPES.RANGE) {
        const rangeFilter = filter as ISearchFilterRange;
        if (!activate) return rangeFilter;
        const option = rangeFilter.options[0];

        return {
          ...filter,
          options: [
            {
              ...option,
              activeMaximum: option.selectedMaximum,
              activeMinimum: option.selectedMinimum,
            },
          ],
        } as ISearchFilterRange;
      }

      const oldOptions = filter.options as ISearchFilterOption[]; // as not range type
      const newOptions = newFilter
        ? (newFilter.options as ISearchFilterOption[])
        : [];

      return {
        ...filter,
        options: oldOptions.map((option) => {
          // Shopify needs to use the option value rather than identifier
          const newOption = newOptions.find(({ identifier }) =>
            identifier && identifier === option.value
              ? option.value
              : option.identifier,
          );
          return {
            ...option,
            ...(activate
              ? {
                active: option.selected,
              }
              : {}),
            records: newOption ? newOption.records : 0,
          };
        }),
      } as ISearchFilterStandard;
    });

    setSearchFilters([...updatedFilters]);
  };

  const wipeLiquidProducts = (): void => {
    const liquidProducts = document.querySelector('[data-liquid-products]');
    if (liquidProducts) {
      liquidProducts.innerHTML = '';
    }
  };

  const refreshFiltersOnly = () => {
    SearchService.methods
      .getProductResults(
        searchFilters,
        activeCollection,
        { term: searchTerm, pageIndex: pageIndex, sortKey: sortKey },
        config,
      )
      .then((response) => {
        if (response.filters) {
          updateFilters(response.filters, false);
        }
        setPendingProductCount(response.total);
      });
  };

  const setResultsClass = (): void => {
    const resultsEl = document.querySelector('.search-results');
    if (resultsEl) {
      resultsEl.classList.add('search__results--loaded');
    }
  };

  const executeSearch = useDebouncedCallback((term) => {
    // result all search results if the search field has been emptied
    if (term.length === 0) {
      setIsSearching(false);
      setQuickSearchResult(null);
      setQuickSearchResultsTypos(null);
      setQuickSearchResultsProducts(null);
      setQuickSearchResultsCollections(null);
      setQuickSearchResultsSuggestions(null);
      setQuickSearchResultsContent(null);
      setQuickSearchResultsPages(null);
      setQuickSearchResultsArticles(null);
      setResultsClass();
    } else {
      SearchService.methods.handleSearch(term, config).then((response) => {
        setIsSearching(false);
        setQuickSearchResult(response);
        setQuickSearchResultsTypos(response.typos);
        setQuickSearchResultsProducts(response.products);
        setQuickSearchResultsCollections(response.collections);
        setQuickSearchResultsSuggestions(response.suggestions);
        setQuickSearchResultsPages(response.pages);
        setQuickSearchResultsArticles(response.articles);
        setQuickSearchResultsContent(null); // @todo
        setResultsClass();
      });
    }
  }, 1000);

  const outputProductData = (
    productData: IGetProductsResult,
    checkPageIndex: number,
  ) => {
    const emptyResponse: IGetProductsResult = {
      records: 0,
      total: 0,
      raw: null,
      products: [],
      filters: [],
    };

    const state = productSearchResultsState;
    if (checkPageIndex) {
      state[checkPageIndex] = productData;
    }

    if (config.rLoadMoreMode !== 'paginate' && checkPageIndex) {
      // infinite scroll set all productResult data (state[0] is undefined, hence .filter)
      const allData = state
        .filter((def) => def)
        .reduce((all, thisData) => {
          return {
            records: all.records + thisData.records,
            total: thisData.total,
            products: [...all.products, ...thisData.products],
            filters: thisData.filters,
            raw: [
              ...(all.raw ?? []),
              //if thisData.raw is an array then spread (I believe this is used for boost)
              //otherwise go and get thisData.raw.queryResults[0].records and spread that (this is used for Klevu v2)
              ...(Array.isArray(thisData.raw)
                ? thisData.raw
                : thisData.raw?.queryResults[0].records.length > 0
                  ? thisData.raw?.queryResults[0].records
                  : []),
            ],
          };
        }, emptyResponse);
      setProductSearchResult(allData);
    } else {
      // pagination, only want specific page of products
      setProductSearchResult(productData);
    }
    setPendingProductCount(productData.total);
  };

  const executeFilteredSearch = useDebouncedCallback((forceIndex = null) => {
    const checkPageIndex = forceIndex ?? pageIndex;
    if (checkPageIndex && productSearchResultsState[checkPageIndex]) {
      wipeLiquidProducts();
      outputProductData(
        productSearchResultsState[checkPageIndex],
        checkPageIndex,
      );
      setFiltersLoading(false);
      setNewPageLoading(false);
    } else {
      SearchService.methods
        .getProductResults(
          searchFilters,
          activeCollection,
          { term: searchTerm, pageIndex: checkPageIndex, sortKey: sortKey },
          config,
        )
        .then((response) => {
          wipeLiquidProducts();
          outputProductData(response, checkPageIndex);
          if (response.filters) {
            updateFilters(response.filters, true);
            setFiltersLoading(false);
          }
          if (checkPageIndex) {
            const state = productSearchResultsState;
            setProductResultsState([...state]);
            setFiltersLoading(false);
          }
          setNewPageLoading(false);
        });
    }
  }, 1000);

  const setLoadingAndExecuteFilteredSearch = () => {
    const liquidProducts = document.querySelector('[data-liquid-products]');

    if (liquidProducts) {
      liquidProducts.classList.add('is-loading');
    }

    setFiltersLoading(true);

    executeFilteredSearch.callback();
  };

  const updatePageIndex = (
    pageIndex: number,
    triggerFiltering: boolean,
    silent: boolean,
    historyMethod: 'pushState' | 'replaceState' = 'pushState',
  ) => {
    if (
      window['theme'].template === 'search' ||
      window['theme'].template === 'collection' ||
      window['ShopifyAnalytics'].meta.page.pageType === 'collection' ||
      window['ShopifyAnalytics'].meta.page.pageType === 'search'
    ) {
      let forceSilentIndex = null;
      setNewPageLoading(true);
      if (!silent) {
        // update state
        setPageIndex(pageIndex);

        // set url param
        updateLocationQuery({
          key: 'page',
          historyMethod,
          value: pageIndex.toString(),
          action: 'set',
        });
      } else {
        // silent update
        forceSilentIndex = pageIndex;
      }

      // re-filter
      if (triggerFiltering) {
        executeFilteredSearch.callback(forceSilentIndex);
      } else {
        setNewPageLoading(false);
      }
    }
  };

  const eventHandlers = {
    filterUpdated: (params: { filterIndex: number; optionIndex: number }) => {
      // get the filter
      const filter = searchFilters[params.filterIndex];
      if (['SINGLE_OPTION', 'MULTI_OPTION'].includes(filter.type)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const options: ISearchFilterOption[] = filter.options;
        options.map((option: ISearchFilterOption) => {
          // Shopify needs to use the option value rather than identifier
          return option.selected
            ? option.value
              ? option.value
              : option.identifier
            : false;
        }).filter((option) => option);

        if (options.length) {
          updateLocationQuery({
            key: `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}`,
            value: options.join(FILTER_QUERY_PARAM_SEPARATOR),
            action: 'set',
          });
        } else {
          if (options.length > 0) {
            updateLocationQuery({
              key: `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}`,
              value: options.join(FILTER_QUERY_PARAM_SEPARATOR),
              action: 'set',
            });
          } else {
            updateLocationQuery({
              key: `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}`,
              action: 'delete',
            });
          }
        }
      } else if (['RANGE'].includes(filter.type)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const option: ISearchFilterRangeOption =
          filter.options[params.optionIndex];
        const isActive =
          option.selectedMinimum > option.minimum ||
          option.selectedMaximum < option.maximum;
        if (isActive) {
          updateLocationQuery({
            key: `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}`,
            value: `${option.selectedMinimum}:${option.selectedMaximum}`,
            action: 'set',
          });
        } else {
          updateLocationQuery({
            key: `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}`,
            action: 'delete',
          });
        }
      } else {
        throw 'Unhandled filter type';
      }

      updatePageIndex(1, false, false, 'replaceState');
      // invalidate paginated state
      setProductResultsState([]);
    },

    sortByUpdated: (params: { sortKey: string }) => {
      if (!SORT_TYPE_VALS.includes(params.sortKey)) {
        console.info('Incorrect sort type');
      }

      updateLocationQuery({
        key: 'sort',
        value: params.sortKey,
        action: 'set',
      });
      setSortKey(params.sortKey);
      updatePageIndex(1, false, false, 'replaceState');
      // invalidate paginated state
      setProductResultsState([]);
    },
  };

  /**
   * Input event handlers
   */
  const inputEventHandlers = {
    handleSearchInputChange: (e) => {
      const query = e.target.value;

      setQuickSearchTerm(query);

      // result all search results if the search field has been emptied
      if (query.length === 0) {
        setQuickSearchResult(null);
        setQuickSearchResultsTypos(null);
        setQuickSearchResultsProducts(null);
        setQuickSearchResultsCollections(null);
        setQuickSearchResultsSuggestions(null);
        setQuickSearchResultsContent(null);
        setQuickSearchResultsPages(null);
        setQuickSearchResultsArticles(null);
        return;
      }

      setIsSearching(true);

      executeSearch.callback(query);
    },

    handleSearchInputKeyPress: (e) => {
      if (e.keyCode === 13) {
        window.location.href = `${getRoute()}search?q=${quickSearchTerm}`;
      }
    },

    handleSearchSuggestionSelected: (index) => {
      // remove any HTML which may have been added to the suggestion result
      const suggestion = quickSearchResultsSuggestions[index].value.replace(
        /(<([^>]+)>)/gi,
        '',
      );
      setIsSearching(true);
      setSearchTerm(suggestion);
      executeSearch.callback(suggestion);
    },

    handleUpdateRangeOption: (
      filterIndex: number,
      optionIndex: number,
      selectedMinimum: number,
      selectedMaximum: number,
    ) => {
      const updatedOption = [...searchFilters][filterIndex].options[
        optionIndex
      ] as ISearchFilterRangeOption;
      updatedOption.selectedMinimum = selectedMinimum;
      updatedOption.selectedMaximum = selectedMaximum;

      const updatedSearchFilters = [...searchFilters];

      updatedSearchFilters[filterIndex].options[optionIndex] = updatedOption;

      setSearchFilters([...updatedSearchFilters]);

      setFiltersToUpdate([
        ...filtersToUpdate,
        {
          filterIndex: filterIndex,
          optionIndex: optionIndex,
        },
      ]);

      refreshFiltersOnly();
    },

    handleToggleMultiOption: (
      filterIndex: number,
      optionIndex: number,
      forceValue?: boolean,
    ) => {
      const updatedOption = [...searchFilters][filterIndex].options[
        optionIndex
      ] as ISearchFilterOption;

      updatedOption.selected =
        typeof forceValue === 'undefined'
          ? !updatedOption.selected
          : forceValue;

      const updatedSearchFilters = [...searchFilters];

      updatedSearchFilters[filterIndex].options[optionIndex] = updatedOption;

      setSearchFilters([...updatedSearchFilters]);

      setFiltersToUpdate([
        ...filtersToUpdate,
        {
          filterIndex: filterIndex,
          optionIndex: optionIndex,
        },
      ]);

      refreshFiltersOnly();
    },

    handleToggleSingleOption: (
      filterIndex: number,
      optionIndex: number,
      value: boolean,
    ) => {
      const updatedFilterOptions = [...searchFilters][filterIndex]
        .options as ISearchFilterOption[];

      for (let i = 0; i < updatedFilterOptions.length; i++) {
        updatedFilterOptions[i].selected = false;
      }

      updatedFilterOptions[optionIndex].selected = value;

      const updatedSearchFilters = [...searchFilters];
      updatedSearchFilters[filterIndex].options = updatedFilterOptions;

      setSearchFilters([...updatedSearchFilters]);

      setFiltersToUpdate([
        ...filtersToUpdate,
        {
          filterIndex: filterIndex,
          optionIndex: optionIndex,
        },
      ]);

      refreshFiltersOnly();
    },

    handleUpdatePageIndex: (
      pageIndex: number,
      triggerFiltering: boolean,
      silent: boolean,
    ) => {
      updatePageIndex(pageIndex, triggerFiltering, silent, 'pushState');
    },

    handleSortByChange: (val: string) => {
      eventHandlers.sortByUpdated({
        sortKey: val,
      });
      setLoadingAndExecuteFilteredSearch();
    },

    handleClearSpecificFilter: (filterIndex: number) => {
      const updatedFilters = [...searchFilters];
      const filterToClear = updatedFilters[filterIndex];
      if (filterToClear.type === 'RANGE') {
        const option = filterToClear.options[0] as ISearchFilterRangeOption;
        option.selectedMaximum = Math.ceil(option.maximum);
        option.selectedMinimum = Math.floor(option.minimum);
      } else {
        const indices = [];
        const ticked = (filterToClear.options as ISearchFilterOption[]).map(
          ({ selected }, i) => ({ selected, i }),
        );
        if (ticked.length) {
          for (const selected of ticked) {
            if (!selected.selected) continue;
            indices.push({ int: selected.i });
          }
        }

        if (!indices.length) {
          return null;
        }
        indices.forEach(({ int }) =>
          inputEventHandlers.handleToggleMultiOption(filterIndex, int),
        );
      }

      setSearchFilters(updatedFilters);
      refreshFiltersOnly();
    },

    handleClearAllFilters: (): void => {
      const updatedFilters: ISearchFilter[] = [...searchFilters];

      for (let i = 0; i < updatedFilters.length; i++) {
        const filter: ISearchFilter = updatedFilters[i];

        if (filter.type === 'RANGE') {
          const option: ISearchFilterRangeOption = filter.options[0];
          option.selectedMaximum = Math.ceil(option.maximum);
          option.selectedMinimum = Math.floor(option.minimum);
          continue;
        }

        for (let j = 0; j < filter.options.length; j++) {
          const option: ISearchFilterRangeOption | ISearchFilterOption =
            filter.options[j];
          option.selected = false;
        }
      }

      setSearchFilters(updatedFilters);
      refreshFiltersOnly();
    },

    handleToggleFilterOpen: (filterIndex: number, value?: boolean) => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
        ? true
        : false;
      const updatedFilters = [...searchFilters].map((filter, index) => {
        if (index !== filterIndex) {
          //close others
          return {
            ...filter,
            open: isDesktop
              ? filter.open
                ? !filter.open
                : filter.open
              : filter.open,
          };
        } else {
          return {
            ...filter,
            open: typeof value !== 'undefined' ? value : !filter.open,
          };
        }
      });
      setSearchFilters(updatedFilters);
    },

    handleApply: () => {
      // invalidate paginated state
      setProductResultsState([]);

      setLoadingAndExecuteFilteredSearch();

      // execute filter updated event
      filtersToUpdate.map(({ filterIndex, optionIndex }) => {
        eventHandlers.filterUpdated({
          filterIndex: filterIndex,
          optionIndex: optionIndex,
        });
      });
    },
  };

  const getCurrentUrlWithTagSet = (tag: string, val: boolean) => {
    const path = window.location.pathname.split('/').filter((part) => part);
    let newPath = `/${path.join('/')}`;
    if (val && path[path.length - 1] !== tag) {
      // needs to add
      newPath = `/${path.join('/')}/${tag}`;
    } else if (!val && path[path.length - 1] === tag) {
      // needs to remove
      newPath = `/${path.slice(0, -1).join('/')}`;
    }
    return `${window.location.origin}${newPath}${window.location.search}${window.location.hash}`;
  };

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const page =
      pageParam && !isNaN(parseInt(pageParam)) ? parseInt(pageParam) : 1;
    if (page) {
      updatePageIndex(page, true, false, 'replaceState');
    }
  };

  //on render
  useEffect(() => {
    //check if url includes filtered as getting weird safari bug, SearchFilteredProducts component was kicking in on PLP when back clicked
    if (window.location.pathname.includes(config.searchFilterDummyTag)) {
      window.addEventListener('popstate', () => handlePopState());
    }
    if (window['swatches'] && Object.keys(window['swatches']).length) {
      const swatches = SearchService.methods.getSwatchData(window['swatches']);
      setFilterSwatches(swatches);
    }

    // added in date logic and local storage to aid efficeiency of collection retrieval
    const now = new Date();
    const localCollections = JSON.parse(
      window.localStorage.getItem('bb-collections'),
    );
    if (
      !localCollections ||
      (localCollections &&
        localCollections['00-timer'] &&
        now > localCollections['00-timer'])
    ) {
      const storageTimeMinutes = 10;
      // used to populate list of collection urls and their ids for use in collecitonOptionFilter
      axios
        .get('/collections/all?view=json')
        .then((res) => {
          if (res.data?.collections) {
            // add an additional timer element to the array so we can store for later checking and invalidate after a time
            window['theme']['collections'] = {
              ...{
                '00-timer': new Date(
                  now.getTime() + storageTimeMinutes * 60000,
                ),
              },
              ...res.data.collections,
            };
            // This is not pretty but is the easiest fix for now - sorry
            axios
              .get('/collections/all?page=2&view=json')
              .then((res) => {
                if (res.data?.collections) {
                  window['theme']['collections'] = {
                    ...window['theme']['collections'],
                    ...res.data.collections,
                  };
                  window.localStorage.setItem(
                    'bb-collections',
                    JSON.stringify(window['theme']['collections']),
                  );
                  // Uncomment the below line to view all collections object
                  // console.log(window['theme']['collections'])
                }
              })
              .catch((e) => {
                console.error(e);
              });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      window['theme']['collections'] = localCollections;
    }
  }, []);

  /**
   * Initialise Search Filters
   */
  useEffect(() => {
    // parse query params for search context
    const params = new URLSearchParams(window.location.search);

    let executeSearch = false;
    let localSearchTerm = null;
    if (!searchTerm) {
      if (params.get('q')) {
        localSearchTerm = params.get('q');
        setSearchTerm(localSearchTerm);
        executeSearch = true;
      }
    }

    if (!pageIndex) {
      if (params.get('page')) setPageIndex(parseInt(params.get('page')));
      else setPageIndex(1);
    }

    if (!sortKey) {
      if (params.get('sort')) {
        setSortKey(params.get('sort'));
        executeSearch = true;
      }
    }

    if (!cmsSearchResults && params.get('q')) {
      SearchService.methods
        .getCmsContent(params.get('q'), config)
        .then((response) => {
          setCmsSearchResults(response);
        })
        .catch((error) => {
          console.error(error);
          // @todo handle error for getting cms content
        });
    }

    if (
      !searchFilters &&
      (window['theme'].template === 'search' ||
        window['theme'].template === 'collection')
    ) {
      SearchService.methods
        .getFilters(activeCollection, localSearchTerm, config)
        .then((response) => {
          //klevu min & max ranges coming back as strings and breaking range slider
          const rangeFilters = response.filters.find(
            (filter) => filter.displayType === 'RANGE',
          );
          if (rangeFilters?.options?.length > 0) {
            const rangeOption = rangeFilters
              .options[0] as ISearchFilterRangeOption;
            if (typeof rangeOption.maximum === 'string') {
              rangeOption.maximum = parseFloat(rangeOption.maximum);
            }
            if (typeof rangeOption.minimum === 'string') {
              rangeOption.minimum = parseFloat(rangeOption.minimum);
            }
          }

          // parse relevant filters from URL
          const selectedFilters = [];
          params.forEach((values, key) => {
            if (key.startsWith(FILTER_QUERY_PARAM_PREFIX)) {
              values.split(',').forEach((value) => {
                selectedFilters.push({
                  filterKey: key,
                  optionKey: value,
                });
              });
            }
          });

          // Initialise filter states
          if (selectedFilters.length > 0) {
            selectedFilters.forEach(
              (selectedFilter: { filterKey: string; optionKey: string }) => {
                // find the filter index
                const filterIndex = response.filters.findIndex((filter) => {
                  return (
                    `${FILTER_QUERY_PARAM_PREFIX}${filter.identifier}` ===
                    selectedFilter.filterKey
                  );
                });

                if (filterIndex === -1) return;

                // toggle the option
                if (
                  ['SINGLE_OPTION', 'MULTI_OPTION'].includes(
                    response.filters[filterIndex].type,
                  )
                ) {
                  // find the option index
                  const optionIndex = response.filters[
                    filterIndex
                  ].options.findIndex((option) => {
                    // Shopify needs to use the option value rather than identifier
                    return option.value
                      ? option.value
                      : option.identifier === selectedFilter.optionKey;
                  });

                  if (optionIndex >= 0) {
                    const option = (
                      response.filters[filterIndex] as ISearchFilterStandard
                    ).options[optionIndex];
                    option.active = true;
                    option.selected = true;
                    executeSearch = true;
                  }
                } else if (
                  ['RANGE'].includes(response.filters[filterIndex].type)
                ) {
                  const option = (
                    response.filters[filterIndex] as ISearchFilterRange
                  ).options[0];
                  option.selectedMinimum = parseFloat(
                    selectedFilter.optionKey.split(':')[0],
                  );
                  option.selectedMaximum = parseFloat(
                    selectedFilter.optionKey.split(':')[1],
                  );
                  option.activeMinimum = option.selectedMinimum;
                  option.activeMaximum = option.selectedMaximum;
                  executeSearch = true;
                }
              },
            );
          }
          setSearchFilters(response.filters);

          if (executeSearch) setLoadingAndExecuteFilteredSearch();
        });
    }

    const selectedFilters = searchFilters
      ? getCurrentActiveFilters(searchFilters)
      : [];
    const updateUrlWithTag = Boolean(
      productSearchResult &&
        activeCollection.handle &&
        (selectedFilters.length > 0 || sortKey),
    );

    const url = getCurrentUrlWithTagSet(
      config.searchFilterDummyTag,
      updateUrlWithTag,
    );
    if (window.history && window.location.toString() !== url) {
      window.history.replaceState({ ...window.history.state }, '', url);
    }
  }, [productSearchResult, searchTerm, sortKey]);

  return (
    <SearchContext.Provider
      value={{
        activeCollection,
        searchTerm,
        quickSearchTerm,
        setQuickSearchTerm,
        pageIndex,
        quickSearchResult,
        quickSearchResultsTypos,
        quickSearchResultsSuggestions,
        quickSearchResultsProducts,
        quickSearchResultsCollections,
        quickSearchResultsContent,
        quickSearchResultsPages,
        quickSearchResultsArticles,
        filterSwatches,
        searchFilters,
        filtersLoading,
        newPageLoading,
        sortKey,
        setSortKey,
        productSearchResult,
        productSearchResultsState,
        cmsSearchResults,
        isSearching,
        inputEventHandlers,
        config,
        pendingProductCount,
        eventHandlers,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = (): ContextValue => useContext(SearchContext);

export default useSearch;
