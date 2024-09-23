import React from "react";
import { ISearchFilterOption } from "../../../../../context/search/types";

interface ITextFilter {
  option: ISearchFilterOption;
}

const TextFilter: React.FunctionComponent<ITextFilter> = ({ option }) => (
  <div className="filter__label">
    {isNaN(option.records) ? (
      option.label
    ) : (
      <>
        {option.label}
        <span className="filter__label-count">({option.records})</span>
      </>
    )}
  </div>
);

export default TextFilter;
