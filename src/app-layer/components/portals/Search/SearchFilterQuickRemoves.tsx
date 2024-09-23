
import React from 'react'
import getCurrentActiveFilters from '../../../context/search/helpers/getCurrentActiveFilters';
import useSearch from '../../../context/search/useSearch'
import Money from '../../Money';



const NUMBER_TO_SHOW = 2;

const SearchFilterQuickRemoves: React.FC = (): JSX.Element => {

  const { searchFilters, inputEventHandlers, config } = useSearch()


  const activeFiltersLength = getCurrentActiveFilters(searchFilters ?? [])?.length ?? 0;

  const renderAppliedFilters = (maxOptionsCount?: number) => {
    let i = 0;


    return searchFilters.map((filter, filterIndex) => {
      // Output for range options
      if (filter.type === 'RANGE') {

        if (maxOptionsCount) {
          i++;
          if (i > maxOptionsCount) {
            return null;
          }
        }

        const rangeOption = filter.options[0]

        const isActive = (rangeOption.activeMinimum > rangeOption.minimum || rangeOption.activeMaximum < rangeOption.maximum)

        if (!isActive) return null

        return (
          <button type="button" onClick={() => {
            inputEventHandlers.handleUpdateRangeOption(
              filterIndex,
              0,
              Math.floor(rangeOption.minimum),
              Math.ceil(rangeOption.maximum)
            )
            inputEventHandlers.handleApply()
          }} className="filter__quick-remove filter__quick-remove--range" key={filterIndex}>
            {filter.label}{': '}
            <Money withCurrency={false} amount={rangeOption.activeMinimum * 100} />
            {' - '}
            <Money withCurrency={false} amount={rangeOption.activeMaximum * 100} />
            <span className="filter__quick-remove-icon">✕</span>
          </button>
        )

      // Output for single and multi options
      } else if (['MULTI_OPTION', 'SINGLE_OPTION'].indexOf(filter.type) > -1) {
        if (maxOptionsCount) {
          if (i > maxOptionsCount) {
            return null;
          }
        }



        return (
          filter.options.map((option, optionIndex) => {
            const label = filter.displayType === 'SWATCH' ? option.label.replace(config.swatchPrefix, '') : option.label

            if (!option.active) return null

            if (maxOptionsCount) {
              i++;
              if (i > maxOptionsCount) {
                return null;
              }
            }

            return (
              <button onClick={() => {
                if (filter.type === 'SINGLE_OPTION') {
                  inputEventHandlers.handleToggleSingleOption(
                    filterIndex,
                    optionIndex,
                    false
                  )
                } else {
                  inputEventHandlers.handleToggleMultiOption(
                    filterIndex,
                    optionIndex,
                    false
                  )
                }
                inputEventHandlers.handleApply()
              }} type='button' key={`${option.identifier}-${optionIndex}`} className="filter__quick-remove">
                {label}
                <span className='filter__quick-remove-icon'>✕</span>
              </button>
            )
          })
        )
      }

      return null;
    })
  }


  if (!searchFilters) return null
  if (activeFiltersLength < 1) return null
  return (
    <div className={'filter__quick-removes'}>
      <div className="filter__quick-removes-label">Refine:</div>
      {
        searchFilters.length && <>
          <div className="filter__quick-removes-filters hide-medium-up">
            <>
              {renderAppliedFilters(NUMBER_TO_SHOW)}
              {activeFiltersLength > NUMBER_TO_SHOW && <span>+{activeFiltersLength - NUMBER_TO_SHOW}</span>}
            </>
            {/* {displayAllMob && <>
              {renderAppliedFilters()}
              <button onClick={() => setDisplayAllMob(false)}>Hide</button>
            </>} */}

          </div>
          <div className="filter__quick-removes-filters hide-below-medium">
            { renderAppliedFilters()}
          </div>
        </>
      }
      {
        searchFilters.length &&
        <a className='filter__quick-removes-clear'
          href={window.location.href.includes('search') ?
            window.location.href.replace(window.location.href, window.location.href.split('&filter')[0]) :
            window.location.href.replace(window.location.search, '').replace(config.searchFilterDummyTag, '')}>
          Clear all
        </a>
      }
    </div>
  )
}

export default SearchFilterQuickRemoves