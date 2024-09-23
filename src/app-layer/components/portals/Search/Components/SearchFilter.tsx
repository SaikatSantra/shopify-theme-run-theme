import React, { useEffect } from 'react'
import {ISearchFilter, ISearchFilterRangeOption} from '../../../../context/search/types';
import FILTER_SEARCH from '../../../../context/search/consts';
import MultiOptionFilter from './FilterTypes/MultiOptionFilter';
import SingleOptionFilter from './FilterTypes/SingleOptionFilter';
import RangeOptionFilter from './FilterTypes/RangeOptionFilter';
import CollectionOptionFilter from './FilterTypes/CollectionOptionFilter';
import useSearch from '../../../../context/search/useSearch';
import { findAncestor } from '../../../../../scripts/utils/dom';

interface Props {
  index: number,
  filter: ISearchFilter
}

const SearchFilter: React.FC<Props> = ({ filter, index }): JSX.Element => {
  const {inputEventHandlers} = useSearch()
  useEffect(() => {
    const handleClickOff = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const searchPortal = findAncestor(el, 'searchFiltersSlideOut')
      if (searchPortal) return
      inputEventHandlers.handleToggleFilterOpen(index, false)
    }
    if (filter.open) {
      document.body.addEventListener('click', handleClickOff)
    }
    return () => document.body.removeEventListener('click', handleClickOff)
  }, [filter.open])

  const renderFilterOptions = (): JSX.Element => {
    if (filter.raw.filterType === 'collection') {
      return (<CollectionOptionFilter filterIndex={index} filter={filter} />)
    } else {
      switch (filter.type) {
        case FILTER_SEARCH.FILTER_TYPES.MULTI_OPTION:
          return (<MultiOptionFilter filterIndex={index} filter={filter} />)
        case FILTER_SEARCH.FILTER_TYPES.SINGLE_OPTION:
          return (<SingleOptionFilter filterIndex={index} filter={filter} />)
        case FILTER_SEARCH.FILTER_TYPES.RANGE:
          return (<RangeOptionFilter filterIndex={index} filter={filter} />)
        default:
          return null
      }
    }
  }

  if (filter.type === FILTER_SEARCH.FILTER_TYPES.RANGE && (filter.options as ISearchFilterRangeOption[])[0].minimum === (filter.options as ISearchFilterRangeOption[])[0].maximum) return null

  return (
    <>
      <div className={ `filter__filter ${filter.open ? 'filter__filter--open': ''}` }>
        <button type="button"
          onClick={() => inputEventHandlers.handleToggleFilterOpen(index)}
          className={ `filter__title ${filter.open ? 'filter__title--open': ''}` }>
          {filter.label}
        </button>
        {renderFilterOptions()}
      </div>
    </>
  )
}

export default SearchFilter