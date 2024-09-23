import React from 'react';
import FILTER_SEARCH from '../../../../../context/search/consts';
import { ISearchFilter, ISearchFilterOption } from '../../../../../context/search/types'
import RatingFilter from './RatingFilter';
import SwatchFilter from './SwatchFilter';
import TextFilter from './TextFilter';

interface IFilterDisplayTypes {
  option: ISearchFilterOption,
  displayType: ISearchFilter['displayType']
}

const FilterDisplayTypes: React.FunctionComponent<IFilterDisplayTypes> = ({ option, displayType }) => {
  switch (displayType) {
    case FILTER_SEARCH.FILTER_DISPLAY_TYPES.TEXT:
    case FILTER_SEARCH.FILTER_DISPLAY_TYPES.BOX:
      return <TextFilter option={option} />
    case FILTER_SEARCH.FILTER_DISPLAY_TYPES.SWATCH:
      return <SwatchFilter option={option} />
    case FILTER_SEARCH.FILTER_DISPLAY_TYPES.RATING:
      return <RatingFilter option={option} />
    default:
      return <TextFilter option={option} />
  }
}

export default FilterDisplayTypes