import React from 'react'
import useSearch from '../../../context/search/useSearch';
import { Interweave } from 'interweave';

interface ISearchResultsTrendingComponent {
  dataSet: DOMStringMap
}

const SearchResultsTrending: React.FunctionComponent<ISearchResultsTrendingComponent> = ({ dataSet }): JSX.Element => {

  const {
    langTitleSearches,
    listSearches,
    langTitlePages,
    listPages,
    langTitleCollections,
    listCollections,
    langTitleProducts,
    listProducts
  } = dataSet

  const {quickSearchResultsSuggestions, quickSearchResultsPages, quickSearchResultsArticles, quickSearchResultsCollections, quickSearchResultsProducts} = useSearch()

  let showSearches = true;
  let showCollections = true;
  let showProducts = true;

  if ((quickSearchResultsSuggestions && quickSearchResultsSuggestions.length) ||
  (quickSearchResultsPages && quickSearchResultsPages.length) ||
  (quickSearchResultsArticles && quickSearchResultsArticles.length) ||
  (quickSearchResultsCollections && quickSearchResultsCollections.length)) {
    showSearches = false;
  }

  if (quickSearchResultsProducts && quickSearchResultsProducts.length) {
    showCollections = false;
    showProducts = false;
  }

  return (
    <>
      {
        showSearches && listSearches ? (
          <div className='search__results search__results--list search__results--trending search__results--loaded'>
            <h5 className={'search__results-title search__results-title--trending heading-5'}>{langTitleSearches}</h5>
            <div className={'search__results-list search__results-list--trending'}>
              <Interweave content={listSearches} noWrap={true}/>
            </div>
          </div>
        ) : null
      }
      {
        showSearches && listPages ? (
          <div className='search__results search__results--list search__results--trending search__results--loaded'>
            <h5 className={'search__results-title search__results-title--trending heading-5'}>{langTitlePages}</h5>
            <div className={'search__results-list search__results-list--trending'}>
              <Interweave content={listPages} noWrap={true}/>
            </div>
          </div>
        ) : null
      }
      {
        showCollections && listCollections ? (
          <div className='search__results search__results--grid search__results--collections search__results--loaded'>
            <h5 className={'search__results-title search__results-title--collections heading-5'}>{langTitleCollections}</h5>
            <div className={'search__results-grid search__results-grid--collections'}>
              <Interweave content={listCollections} noWrap={true} />
            </div>
          </div>
        ) : null
      }
      {
        showProducts && listProducts ? (
          <div className='search__results search__results--grid search__results--products search__results--loaded'>
            <h5 className={'search__results-title search__results-title--products heading-5'}>{langTitleProducts}</h5>
            <div className={'search__results-grid search__results-grid--products'}>
              <Interweave content={listProducts} noWrap={true} />
            </div>
          </div>
        ) : null
      }
    </>
  )
}

export default SearchResultsTrending