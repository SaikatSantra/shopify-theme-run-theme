import React from 'react';
import useSearch from '../../../context/search/useSearch';

interface ISearchResultsPagesComponent {
  dataSet: DOMStringMap;
}

const SearchResultsPages: React.FC<ISearchResultsPagesComponent> = ({
  dataSet,
}): JSX.Element => {
  const { langTitle } = dataSet;

  const { quickSearchResultsPages } = useSearch();

  if (quickSearchResultsPages && !quickSearchResultsPages.length) return null;

  return (
    <div
      className={`search__results search__results--list search__results--pages ${quickSearchResultsPages && quickSearchResultsPages.length && 'search__results--loaded'}`}
    >
      {quickSearchResultsPages && quickSearchResultsPages.length && (
        <>
          <div
            className={
              'search__results-title search__results-title--pages heading-5'
            }
          >
            {langTitle}
          </div>
          <div className={'search__results-list search__results-list--pages'}>
            <ul>
              {quickSearchResultsPages.map((page, index) => {
                return (
                  <li
                    className={
                      'search__results-item search__results-item--pages'
                    }
                    key={index}
                  >
                    <a href={page.url}>{page.title}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResultsPages;
