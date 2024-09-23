import React, { useState } from 'react';

import { ISearchFilter, ISearchFilterRangeOption } from '../../../../../context/search/types';

import useSearch from '../../../../../context/search/useSearch';
import Money from '../../../../Money';
import DualRangeSlider from '../../../../RangeSliders/DualRangeSlider';
import ClearAndApplyButton from '../ClearAndApplyButton';
import handleModalClose from '../../../../../util/handleModalClose';

interface IMultiOptionFilter {
  filterIndex: number,
  filter: ISearchFilter,
}

/*
 *
 * @param filterIndex
 * @param filter
 * @constructor
 */


const RangeOptionFilter: React.FC<IMultiOptionFilter> = ({filterIndex, filter}): JSX.Element => {

  const { inputEventHandlers, eventHandlers } = useSearch()

  const [enableClear, setEnableClear] = useState(false)
  const [filtersChanged, setFiltersChanged] = useState(false)

  const onChangeHandler = (vals: [number, number], index: number) => {
    inputEventHandlers.handleUpdateRangeOption(filterIndex, index, vals[0], vals[1]);
    eventHandlers.filterUpdated({
      filterIndex: filterIndex,
      optionIndex: index,
    })
    setEnableClear(true)
    setFiltersChanged(true)

    // If using vertical filters you may want to apply it immediately
    // on desktop. If so replace the above code with the following

    // if (window.matchMedia('(max-width: 767px)').matches) {
    //   eventHandlers.filterUpdated({
    //     filterIndex: filterIndex,
    //     optionIndex: index,
    //   })
    //   setShowClear(true)
    //   setFiltersChanged(true)
    //   inputEventHandlers.handleApply();
    // }
  }

  if (!filter.open) return null

  return (
    <>
      <div className={'filter__options filter__options--range'}>
        <div className={'filter__items filter__items--range'}>
          {
            (filter.options as ISearchFilterRangeOption[]).map((option: ISearchFilterRangeOption, index) => {
              return (
                <DualRangeSlider
                  key={index}
                  range={[option.minimum, option.maximum]}
                  values={[option.selectedMinimum, option.selectedMaximum]}
                  onChange={(vals) => onChangeHandler(vals, index)}>
                  {({ value, labelHandle }) => <span><label>{ labelHandle }: </label><Money amount={value * 100} /></span>}
                </DualRangeSlider>
              )
            })
          }
        </div>

        <div className="filter__clear-apply">
          <ClearAndApplyButton
            showClear={true}
            enableClear={enableClear}
            showApply={true}
            enableApply={filtersChanged}
            afterClear={() => setFiltersChanged(true)}
            afterApply={() => {
              inputEventHandlers.handleToggleFilterOpen(filterIndex, false)
              handleModalClose(['filters-open'])
            }
            }
            filterIndexToClear={filterIndex} />
        </div>
      </div>
    </>
  )
}

export default RangeOptionFilter