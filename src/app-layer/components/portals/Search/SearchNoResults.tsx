import React from "react";
import useSearch from "../../../context/search/useSearch";

interface ISearchNoResultsComponent {
  dataSet: DOMStringMap;
}

const SearchNoResults: React.FC<ISearchNoResultsComponent> = ({
  dataSet,
}): JSX.Element => {
  const { noResults } = dataSet;
  const { quickSearchResultsProducts, quickSearchTerm } = useSearch();

  return quickSearchResultsProducts && !quickSearchResultsProducts.length ? (
    <p className="paragraph">
      {" "}
      {noResults.replace(/\[\[searchword\]\]/g, `${quickSearchTerm}`)}
    </p>
  ) : null;
};

export default SearchNoResults;
