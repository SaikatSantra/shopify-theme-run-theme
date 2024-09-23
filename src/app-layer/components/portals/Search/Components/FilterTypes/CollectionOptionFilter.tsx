import React, { useState } from "react";

import {
  ISearchFilter,
  ISearchFilterOption,
} from "../../../../../context/search/types";
import TextFilter from "../FilterDisplayTypes/TextFilter";
import useSearch from "../../../../../context/search/useSearch";
import ClearAndApplyButton from "../ClearAndApplyButton";
import handleModalClose from "../../../../../util/handleModalClose";
import handleize from "../../../../../../scripts/utils/handleize";

interface ISingleOptionFilter {
  filterIndex: number;
  filter: ISearchFilter;
}

const CollectionOptionFilter: React.FC<ISingleOptionFilter> = ({
  filterIndex,
  filter,
}): JSX.Element => {
  const { inputEventHandlers } = useSearch();

  const [filtersChanged, setFiltersChanged] = useState(false);

  const enableClear = (filter.options as ISearchFilterOption[]).some(
    (option) => option.selected,
  );

  if (!filter.open) return null;

  return (
    <div
      className={`filter__options filter__options--collection filter__options--${filter.displayType.toLowerCase()}`}
    >
      <div
        className={`filter__items filter__items--${filter.displayType.toLowerCase()}`}
      >
        {(filter.options as ISearchFilterOption[]).map(
          (option: ISearchFilterOption, index: number) => {
            const optionId =
              typeof option.identifier === "string"
                ? option.identifier
                : option.label;
            const handle = handleize(optionId);
            const collectionUrl = window["theme"]["collections"][handle]?.url;
            const disabled = option.records < 1 && !option.selected;
            const newUrl = window.location.search
              ? collectionUrl + window.location.search
              : collectionUrl;
            return collectionUrl ? (
              <div
                className={`filter__option filter__option--single ${window.location.pathname === collectionUrl || window.location.pathname === collectionUrl + "/filtered" ? "filter__option--selected" : ""} ${disabled ? " filter__option--disabled" : ""} filter__option--${filter.displayType.toLowerCase()}`}
                key={index}
              >
                <a href={newUrl}>
                  <TextFilter option={option} />
                </a>
              </div>
            ) : null;
          },
        )}
      </div>

      <div className="filter__clear-apply">
        <ClearAndApplyButton
          showClear={true}
          enableClear={enableClear}
          showApply={true}
          enableApply={filtersChanged}
          afterClear={() => setFiltersChanged(true)}
          afterApply={() => {
            inputEventHandlers.handleToggleFilterOpen(filterIndex, false);
            handleModalClose(["filters-open"]);
          }}
          filterIndexToClear={filterIndex}
        />
      </div>
    </div>
  );
};

export default CollectionOptionFilter;
