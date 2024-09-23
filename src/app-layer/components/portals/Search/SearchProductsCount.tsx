import React from "react";
import useSearch from "../../../context/search/useSearch";

const SearchFilterCount: React.FC = () => {
  const { productSearchResult } = useSearch();
  if (!productSearchResult) return <>{window["blubolt"].collectionCount}</>;
  return <>{productSearchResult.total}</>;
};

export default SearchFilterCount;
