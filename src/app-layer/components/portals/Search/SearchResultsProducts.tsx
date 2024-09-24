import React, { useEffect } from 'react';
import useSearch from '../../../context/search/useSearch';
import SearchProductCard from './Components/SearchProductCard';

interface ISearchResultsProductsComponent {
  dataSet: DOMStringMap;
}

const SearchResultsProducts: React.FC<ISearchResultsProductsComponent> = ({
  dataSet,
}): JSX.Element => {
  const { langTitle } = dataSet;
  const { quickSearchResultsProducts, quickSearchTerm } = useSearch();

  useEffect(() => {
    if (quickSearchTerm && quickSearchResultsProducts) {
      document.querySelector('body').classList.add('search-loaded');
    } else {
      document.querySelector('body').classList.remove('search-loaded');
    }
  }, [quickSearchResultsProducts]);

  return quickSearchResultsProducts && quickSearchResultsProducts.length ? (
    <div
      className={`search__results search__results--grid search__results--products ${quickSearchResultsProducts && quickSearchResultsProducts.length && 'search__results--loaded'}`}
    >
      {quickSearchResultsProducts && quickSearchResultsProducts.length && (
        <>
          {langTitle && (
            <h5
              className={
                'search__results-title search__results-title--products heading-5'
              }
            >
              {langTitle}
            </h5>
          )}

          <div
            className={'search__results-grid search__results-grid--products'}
          >
            {quickSearchResultsProducts.slice(0, 3).map((product, index) => {
              return (
                <SearchProductCard
                  key={index}
                  product={product}
                  simple={true}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  ) : null;
};

export default SearchResultsProducts;
