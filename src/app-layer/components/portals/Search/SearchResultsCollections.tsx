import React from "react";
import useSearch from "../../../context/search/useSearch";

interface ISearchResultsCollectionsComponent {
  dataSet: DOMStringMap;
}

const SearchResultsCollections: React.FC<
  ISearchResultsCollectionsComponent
> = ({ dataSet }): JSX.Element => {
  const { langTitle } = dataSet;

  const { quickSearchResultsCollections } = useSearch();

  if (quickSearchResultsCollections && !quickSearchResultsCollections.length)
    return null;

  return (
    <div
      className={`search__results search__results--list search__results--collections ${quickSearchResultsCollections && quickSearchResultsCollections.length && "search__results--loaded"}`}
    >
      {quickSearchResultsCollections &&
        quickSearchResultsCollections.length && (
          <>
            <div
              className={
                "search__results-title search__results-title--collections heading-5"
              }
            >
              {langTitle}
            </div>
            <div
              className={
                "search__results-list search__results-list--collections"
              }
            >
              <ul>
                {quickSearchResultsCollections.map((collection, index) => {
                  return (
                    <li
                      className={
                        "search__results-item search__results-item--collections"
                      }
                      key={index}
                    >
                      <a href={collection.url}>{collection.title}</a>
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

export default SearchResultsCollections;
