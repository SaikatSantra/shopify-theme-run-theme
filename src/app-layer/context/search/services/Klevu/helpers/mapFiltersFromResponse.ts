import {ISearchFilter, ISearchFilterOption, ISearchFilterRangeOption} from '../../../types';

const transformFilterLabel = (label) => {
  switch (label) {
    case 'klevu_price':
      return 'Price';
    default:
      return label
  }
}

const mapFiltersFromResponse = (response: {
  data: any
}): ISearchFilter[] => {
  return response.data.queryResults[0].filters.map((filter) => {
    const f: ISearchFilter = {
      identifier: filter.key,
      label: transformFilterLabel(filter.label),
      initiallyOpen: false,
      type: null,
      options: [],
      raw: filter,
      open: false,
      displayType: null
    }

    switch (filter.type) {
      case 'OPTIONS':
        f.type = 'MULTI_OPTION'
        f.displayType = 'TEXT'
        f.options = filter.options.map((option) => {
          return <ISearchFilterOption>{
            identifier: option.value,
            label: option.name,
            selected: false,
            records: option.count
          }
        })
        break;
      case 'SLIDER':
        f.type = 'RANGE'
        f.displayType = 'RANGE'
        f.options[0] = <ISearchFilterRangeOption>{
          minimum: filter.min,
          maximum: filter.max,
          selectedMinimum: filter.min,
          selectedMaximum: filter.max,
          selected: false
        }
        break;
    }

    return f
  })
}

export default mapFiltersFromResponse