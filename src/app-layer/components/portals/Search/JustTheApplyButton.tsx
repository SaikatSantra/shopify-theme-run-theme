import React from 'react';
import useSearch from '../../../context/search/useSearch';

const JustTheApplyButton: React.FunctionComponent = () => {
  const { pendingProductCount, inputEventHandlers } = useSearch();
  return (
    <>
      <button
        type="button"
        className="btn btn--primary btn--block apply-close"
        disabled={!pendingProductCount}
        onClick={() => {
          inputEventHandlers.handleApply();
          document.body.classList.remove('filters-open');
        }}
      >
        Apply{' '}
        {pendingProductCount &&
        !isNaN(pendingProductCount) &&
        pendingProductCount > 0
          ? `(${pendingProductCount})`
          : ''}
      </button>
    </>
  );
};

export default JustTheApplyButton;
