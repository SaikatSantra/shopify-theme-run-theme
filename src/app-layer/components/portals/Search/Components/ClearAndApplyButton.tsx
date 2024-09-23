import React from 'react';
import useSearch from '../../../../context/search/useSearch';

interface Props {
  showClear?: boolean
  enableClear?: boolean
  showApply?: boolean
  enableApply?: boolean
  filterIndexToClear?: number,
  afterApply?: () => void
  afterClear?: () => void

}

const ClearAndApplyButton: React.FunctionComponent<Props> = ({ showClear, enableClear, showApply, enableApply, filterIndexToClear, afterApply, afterClear }) => {
  const { inputEventHandlers, pendingProductCount } = useSearch()

  return (
    <>
      { showClear ?
        <button
          type="button"
          disabled={!enableClear}
          className='btn btn--primary-outline btn--block clear-close'
          onClick={() => {
            if (!enableClear) return
            inputEventHandlers.handleClearSpecificFilter(filterIndexToClear)
            afterClear()
          }
          }>Clear</button>
        : ''}
      { showApply ?
        <button
          type='button'
          disabled={!enableApply || !pendingProductCount}
          className='btn btn--primary btn--block apply-close'
          onClick={() => {
            if (!enableApply) return
            inputEventHandlers.handleApply()
            afterApply()
          }
          }>Apply{pendingProductCount && !isNaN(pendingProductCount) && pendingProductCount > 0 ? ` (${pendingProductCount})` : '' }</button>
        : ''}

    </>
  )
}

export default ClearAndApplyButton