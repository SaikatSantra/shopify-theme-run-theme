import {
  ISearchFilter,
  ISearchFilterOption,
  ISearchFilterRangeOption,
} from "../../../types";

const mapFilters = (response: { data: any }): ISearchFilter[] => {
  return response.data.filter.options.flatMap((filter) => {
    if (filter.status === "disabled") {
      return [];
    }
    const f: ISearchFilter = {
      identifier: filter.filterOptionId,
      initiallyOpen: false,
      label: filter.label,
      type: null,
      displayType: null,
      options: [],
      raw: filter,
      open: false,
    };

    const prefix: RegExp | null = filter.prefix
      ? new RegExp(filter.prefix)
      : null;

    switch (filter.displayType) {
      case "box":
      case "swatch":
      case "list":
      case "rating":
        f.type =
          filter.selectType === "multiple" ? "MULTI_OPTION" : "SINGLE_OPTION";
        f.displayType = "TEXT";
        if (filter.displayType === "box") {
          f.displayType = "BOX";
        } else if (filter.displayType === "swatch") {
          f.displayType = "SWATCH";
        } else if (filter.displayType === "rating") {
          f.displayType = "RATING";
        }
        f.options = filter.values.map((value) => {
          const valueLabel = value.label ? value.label : value.key;
          const label = prefix ? valueLabel.replace(prefix, "") : valueLabel;
          let { key } = value;
          if (filter.filterType === "stock") {
            //stock types have different identifier logic
            key = value.key === "in-stock" ? "true" : "false";
          }
          return <ISearchFilterOption>{
            identifier: key,
            label,
            value: key,
            selected: false,
            active: false,
            records: value.doc_count,
          };
        });
        break;
      case "range":
        f.type = "RANGE";
        f.displayType = "RANGE";
        f.options[0] = <ISearchFilterRangeOption>{
          minimum: parseFloat(filter.values.min),
          maximum: parseFloat(filter.values.max),
          selectedMinimum: Math.floor(parseFloat(filter.values.min)),
          selectedMaximum: Math.ceil(parseFloat(filter.values.max)),
          activeMinimum: Math.floor(parseFloat(filter.values.min)),
          activeMaximum: Math.ceil(parseFloat(filter.values.max)),
          active: false,
          selected: false,
        };
        break;
      default:
        throw new Error("Filter type not implemented");
    }
    return f;
  });
};

export default mapFilters;
