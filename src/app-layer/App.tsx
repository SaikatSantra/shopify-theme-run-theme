import React, { Suspense, useEffect } from 'react';
import PortalLoader from './components/PortalLoader';
import LoadingBar from './components/portals/LoadingBar';
import { useCart } from './hooks/useCart';
import CONSTANTS from './_constants';
import { Toast } from './components/portals/Toast';
import { useDispatch } from 'react-redux';

import { dispatchToast } from './store/actions/toast';
import CartCountBadge from './components/portals/CartCountBadge';
import CartTotal from './components/portals/CartTotal';
import ProductRecommendations from './components/portals/ProductRecommendations';

import MiniCart from './components/portals/MiniCart/index'
import { CartUpsells } from './components/portals/CartUpsells/CartUpsells'
import QuickAdd from './components/portals/QuickAdd/index'
import RecentlyViewed from './components/portals/RecentlyViewed/index';

import SearchInput from './components/portals/Search/SearchInput'
import SearchResultsSuggestions from './components/portals/Search/SearchResultsSuggestions'
import SearchResultsCollections from './components/portals/Search/SearchResultsCollections'
import SearchResultsProducts from './components/portals/Search/SearchResultsProducts';
import SearchFilters from './components/portals/Search/SearchFilters';
import SearchFilteredProducts from './components/portals/Search/SearchFilteredProducts';
import {SearchProvider} from './context/search/useSearch';
import SearchSubmit from './components/portals/Search/SearchSubmit';
import SearchFilterCount from './components/portals/Search/SearchFilterCount';
import SearchProductsCount from './components/portals/Search/SearchProductsCount';
import SearchSortBy from './components/portals/Search/SearchSortBy';
import SearchResultsPages from './components/portals/Search/SearchResultsPages';
import SearchFilterQuickRemoves from './components/portals/Search/SearchFilterQuickRemoves';
import JustTheApplyButton from './components/portals/Search/JustTheApplyButton';
import SearchResultsArticles from './components/portals/Search/SearchResultsArticles';
import SearchNoResults from './components/portals/Search/SearchNoResults';
import SearchResultsTrending from './components/portals/Search/SearchResultsTrending';
import PromoBar from './components/portals/PromoBar/PromoBar';
import LoadingIcon from './components/portals/MiniCart/Loading';

type AppProps = {
  config: any,
}

export const App: React.FC<AppProps> = ({ config }) => {

  const dispatch = useDispatch();

  const { getCartState, setDOMHelpers, cart } = useCart();

  useEffect(() => {
    getCartState()
  }, []);

  useEffect(() => {
    setDOMHelpers()
  },[cart])

  window['blubolt'].dispatchToast = (type: string, data: any) => dispatch(dispatchToast(type, data));

  return (
    <div>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.LOADING}
          Component={LoadingBar}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.PROMO_BAR}
          Component={PromoBar}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.TOAST}
          Component={Toast}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.CART_COUNT_BADGE}
          Component={CartCountBadge}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.CART_TOTAL}
          Component={CartTotal}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.RECENTLY_VIEWED}
          Component={RecentlyViewed}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.PRODUCT_RECOMMENDATIONS}
          Component={ProductRecommendations}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.CART_UPSELLS}
          Component={CartUpsells}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.MINICART}
          Component={MiniCart}
        />
      </Suspense>
      <Suspense fallback={<LoadingIcon />}>
        <PortalLoader
          dataAttr={CONSTANTS.PORTALS.QUICKADD}
          Component={QuickAdd}
        />
      </Suspense>
      { config.appLayerConfigSearch
        && config.appLayerConfigSearchProductsPerPage
        && config.appLayerConfigSearchLoadMoreMode
        && <SearchProvider
          config={{
            ...config.appLayerConfigSearch,
            rProductsPerPage: config.appLayerConfigSearchProductsPerPage,
            rLoadMoreMode: config.appLayerConfigSearchLoadMoreMode,
            searchFilterDummyTag: config.appLayerConfigSearchFilterDummyTag,
            marketsEnabled: config.appLayerConfigMarketsEnabled > 1
          }}
          activeCollection={{
            id: config.appLayerConfigActiveCollectionId ?? null,
            title: config.appLayerConfigActiveCollectionTitle ?? null,
            handle: config.appLayerConfigActiveCollectionHandle ?? null,
          }}>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_INPUT}
              Component={SearchInput}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_TRENDING}
              Component={SearchResultsTrending}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_SUBMIT}
              Component={SearchSubmit}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_NO_RESULTS}
              Component={SearchNoResults}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_SUGGESTIONS}
              Component={SearchResultsSuggestions}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_COLLECTIONS}
              Component={SearchResultsCollections}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_PAGES}
              Component={SearchResultsPages}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_ARTICLES}
              Component={SearchResultsArticles}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_PRODUCTS}
              Component={SearchResultsProducts}
            />
          </Suspense>

          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_FILTER_QUICK_REMOVES}
              Component={SearchFilterQuickRemoves}
            />
          </Suspense>

          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_FILTERS}
              Component={SearchFilters}
            />
          </Suspense>

          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_FILTERED_PRODUCTS}
              Component={SearchFilteredProducts}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_PRODUCTS_COUNT}
              Component={SearchProductsCount}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_FILTER_COUNT}
              Component={SearchFilterCount}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_SORT_BY}
              Component={SearchSortBy}
            />
          </Suspense>
          <Suspense fallback={<LoadingIcon />}>
            <PortalLoader
              dataAttr={CONSTANTS.PORTALS.SEARCH_FILTER_JUST_APPLY}
              Component={JustTheApplyButton}
            />
          </Suspense>
        </SearchProvider>
      }
    </div>
  )
}

export default App;
