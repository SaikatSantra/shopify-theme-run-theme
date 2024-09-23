import React from "react";
import useSearch from "../../../context/search/useSearch";

interface ISearchResultsArticlesComponent {
  dataSet: DOMStringMap;
}

const SearchResultsArticles: React.FC<ISearchResultsArticlesComponent> = ({
  dataSet,
}): JSX.Element => {
  const { langTitle } = dataSet;

  const { quickSearchResultsArticles } = useSearch();

  if (quickSearchResultsArticles && !quickSearchResultsArticles.length)
    return null;

  return (
    <div
      className={`search__results search__results--list search__results--articles ${quickSearchResultsArticles && quickSearchResultsArticles.length && "search__results--loaded"}`}
    >
      {quickSearchResultsArticles && quickSearchResultsArticles.length && (
        <>
          <div
            className={
              "search__results-title search__results-title--articles heading-5 "
            }
          >
            {langTitle}
          </div>
          <div
            className={"search__results-list search__results-list--articles"}
          >
            <ul>
              {quickSearchResultsArticles.map((article, index) => {
                return (
                  <li
                    className={
                      "search__results-item search__results-item--articles"
                    }
                    key={index}
                  >
                    <a href={article.url}>{article.title}</a>
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

export default SearchResultsArticles;
