import React, { useEffect, useState } from "react";
import {
  ISearchFilter,
  ISearchFilterOption,
} from "../../../../../context/search/types";
import useSearch from "../../../../../context/search/useSearch";
import ClearAndApplyButton from "../ClearAndApplyButton";
import FilterDisplayTypes from "../FilterDisplayTypes/FilterDisplayTypes";
import handleModalClose from "../../../../../util/handleModalClose";

interface IMultiOptionFilter {
  filterIndex: number;
  filter: ISearchFilter;
}

const MultiOptionFilter: React.FC<IMultiOptionFilter> = ({
  filterIndex,
  filter,
}): JSX.Element => {
  const { inputEventHandlers, eventHandlers } = useSearch();

  const [filtersChanged, setFiltersChanged] = useState(false);

  const enableClear = (filter.options as ISearchFilterOption[]).some(
    (option) => option.selected,
  );

  useEffect(() => {
    //on close apply filters if they have changed
    if (!filter.open && filtersChanged) {
      inputEventHandlers.handleApply();
    }
  }, [filter.open]);

  if (!filter.open) return null;

  return (
    <>
      <div
        className={`filter__options filter__options--multi filter__options--${filter.displayType.toLowerCase()}`}
      >
        <div
          className={`filter__items filter__items--${filter.displayType.toLowerCase()}`}
        >
          {(filter.options as ISearchFilterOption[]).map((option, index) => {
            const disabled = option.records < 1 && !option.selected;
            return (
              <label
                className={`filter__option filter__option--multi  ${option.selected ? "filter__option--selected" : ""} ${disabled ? "filter__option--disabled" : ""} filter__option--${filter.displayType.toLowerCase()}`}
                key={index}
              >
                <input
                  onChange={() => {
                    inputEventHandlers.handleToggleMultiOption(
                      filterIndex,
                      index,
                    );

                    eventHandlers.filterUpdated({
                      filterIndex: filterIndex,
                      optionIndex: index,
                    });
                    setFiltersChanged(true);

                    // If using vertical filters you may want to apply it immediately
                    // on desktop. If so replace the above code with the following

                    // if (window.matchMedia('(max-width: 767px)').matches) {
                    //   eventHandlers.filterUpdated({
                    //     filterIndex: filterIndex,
                    //     optionIndex: index,
                    //   })
                    //   setFiltersChanged(true)
                    //   inputEventHandlers.handleApply();
                    // }
                  }}
                  checked={option.selected}
                  className="visually-hidden"
                  disabled={disabled}
                  type="checkbox"
                />
                <FilterDisplayTypes
                  option={option}
                  displayType={filter.displayType}
                />
              </label>
            );
          })}
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
    </>
  );
};

export default MultiOptionFilter;
