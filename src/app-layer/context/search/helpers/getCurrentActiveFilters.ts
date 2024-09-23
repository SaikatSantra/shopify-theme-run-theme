import {
  ISearchFilter,
  ISearchFilterOption,
  ISearchFilterRangeOption,
} from "../types";

const getCurrentActiveFilters = (
  filters: ISearchFilter[],
): (ISearchFilterOption | ISearchFilterRangeOption)[] =>
  filters.flatMap((filter) => {
    const standardOptions =
      filter.type !== "RANGE"
        ? [...filter.options].flatMap((option) => (option.active ? option : []))
        : [];
    const rangeOptions =
      filter.type === "RANGE"
        ? [...filter.options].flatMap((rangeOption) =>
            rangeOption.selectedMinimum > rangeOption.minimum ||
            rangeOption.activeMinimum > rangeOption.minimum ||
            rangeOption.selectedMaximum < rangeOption.maximum ||
            rangeOption.activeMaximum < rangeOption.maximum
              ? rangeOption
              : [],
          )
        : [];
    const ret = [...rangeOptions, ...standardOptions];
    return ret;
  });

export default getCurrentActiveFilters;
