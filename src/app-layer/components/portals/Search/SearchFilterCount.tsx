import React from "react";
import getCurrentActiveFilters from "../../../context/search/helpers/getCurrentActiveFilters";
import useSearch from "../../../context/search/useSearch";

const SearchFilterCount: React.FC = () => {
  const { searchFilters } = useSearch();
  if (!searchFilters) {
    return null;
  }
  const selectedFilters = getCurrentActiveFilters(searchFilters);
  if (!selectedFilters || !selectedFilters.length) {
    return null;
  }
  return <>({selectedFilters.length})</>;
};

export default SearchFilterCount;
