import React from 'react';
import useSearch from '../../../context/search/useSearch';
import SearchFilter from './Components/SearchFilter';
import ClearAndApplyButton from './Components/ClearAndApplyButton';
import handleModalClose from '../../../util/handleModalClose';

const SearchFilters: React.FC = (): JSX.Element => {
  const { inputEventHandlers, searchFilters } = useSearch();

  return (
    <>
      <div className={'filter__container'}>
        {!searchFilters && <div>Loading Filters...</div>}
        {searchFilters && (
          <>
            {searchFilters.map((filter, index) => {
              if (filter.options.length > 0) {
                return (
                  <SearchFilter key={index} index={index} filter={filter} />
                );
              }
              return null;
            })}
          </>
        )}
      </div>
      <div className="filter__clear-apply">
        <ClearAndApplyButton
          showClear={true}
          showApply={true}
          afterClear={() => {
            inputEventHandlers.handleClearAllFilters();
            inputEventHandlers.handleApply();
            handleModalClose(['filters-open']);
          }}
          afterApply={() => {
            inputEventHandlers.handleApply();
            handleModalClose(['filters-open']);
          }}
        />
      </div>
    </>
  );
};

export default SearchFilters;
