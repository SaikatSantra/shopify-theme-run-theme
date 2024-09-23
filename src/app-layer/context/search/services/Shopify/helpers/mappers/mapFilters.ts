import { ISearchFilter, ISearchFilterOption, ISearchFilterRangeOption } from '../../../../types';
import { IFilterResponse } from '../../types';

const mapFilters = (filtersInResp: IFilterResponse[]): ISearchFilter[] => {
  return filtersInResp.map((filterInResp: IFilterResponse) => {
    const mappedFilter: ISearchFilter = {
      identifier: filterInResp.id,
      initiallyOpen: false,
      label: filterInResp.label,
      type: null,
      displayType: null,
      options: [],
      raw: filterInResp,
      open: false,
      presentation: null
    };

    switch (filterInResp.type) {
      case 'list':
        mappedFilter.type = 'MULTI_OPTION';
        // This causes issues because any metaobject filter is returned as a swatch by Shopify
        // mappedFilter.displayType = filterInResp.presentation && filterInResp.presentation === 'swatch' ? 'SWATCH' : 'TEXT';
        // Instead we're checking the id, which should have 'swatch' in the name if the metafields have been setup correctly
        mappedFilter.displayType = filterInResp.id.includes('swatch') ? 'SWATCH' : 'TEXT';

        mappedFilter.options = filterInResp.values.map(value => {
          return <ISearchFilterOption>{
            identifier: value.label,
            label: value.label,
            value: value.value,
            selected: false,
            active: false,
            records: value.count
          };
        });

        break;
      case 'price_range':
        mappedFilter.type = 'RANGE';
        mappedFilter.displayType = 'RANGE';

        // Shopify returns the price range in pence.

        mappedFilter.options[0] = <ISearchFilterRangeOption>{
          minimum: filterInResp.rangeMin / 100,
          maximum: filterInResp.rangeMax / 100,
          selectedMinimum: filterInResp.minValue / 100,
          selectedMaximum: filterInResp.maxValue / 100,
          activeMinimum: filterInResp.minValue / 100,
          activeMaximum: filterInResp.maxValue / 100,
          selected: false
        };

        break;
      default:
        throw new Error('Shopify filter type not implemented.');
    }

    return mappedFilter;
  });
};

export default mapFilters;
