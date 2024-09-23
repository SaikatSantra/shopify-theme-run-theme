import React, { useEffect } from 'react'
import useSearch from '../../../context/search/useSearch';

interface ISearchInputComponent {
  dataSet: DOMStringMap
}

const SearchInput: React.FC<ISearchInputComponent> = ({dataSet}): JSX.Element => {

  const { langSearchInputPlaceholder, langSearchInputValue, langSearchClear } = dataSet

  const {quickSearchTerm, inputEventHandlers, setQuickSearchTerm, isSearching} = useSearch()

  const setBodyClass = (show) => {
    show ? document.body.classList.add('search-open', 'modal-open') : document.body.classList.remove('search-open', 'modal-open');
  }

  const handleKeyDown = (e) => {
    inputEventHandlers.handleSearchInputKeyPress(e)
  }

  const handleOnChange = (e) => {
    inputEventHandlers.handleSearchInputChange(e)
  }

  const handleFocus = () => {
    setBodyClass(true)
  }

  // const handleBlur = () => {
  //   document.body.addEventListener('click', e => {
  //     // If we click and we're not within the search results or search wrapper then remove the body class if the search modal is open
  //     !(e.target as HTMLElement).closest('[data-search-content]') && !(e.target as HTMLElement).closest('[data-search-wrapper]') && document.body.classList.contains('search-open') ? setBodyClass(false) : null;
  //   })
  // }

  useEffect(() => {
    window.addEventListener('blubolt:close-search', () => {
      setQuickSearchTerm('')
      handleOnChange({
        target: {
          value: ''
        }
      })
    })
  }, []);
  // console.log(`quickSearchTerm -${quickSearchTerm}`);
  // console.log(`quickSearchTerm-length - ${quickSearchTerm.length},isSearching - ${!isSearching} `);
  return (
    <>
      <div className={'search__input-container'}>
        <input
          tabIndex={0}
          className={'search__input tsx-class'}
          id={'search__input'}
          type="text"
          placeholder={langSearchInputPlaceholder}
          value={quickSearchTerm ? quickSearchTerm : langSearchInputValue}
          // onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
        />
        {isSearching && <div className={'search__is-searching'}></div>}

        {quickSearchTerm && quickSearchTerm.length && !isSearching &&
          <button
            onClick={(e) => {
              setQuickSearchTerm('')
              handleOnChange(e)
              setBodyClass(false)
            }}
            className={'search__clear'}
          >{langSearchClear}</button>}
      </div>
      <button
        className="search__close 6"
        type="button"
        aria-label="Close search"
        data-click-toggle='{"target": "body", "remove": "search-open"}'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clipPath="url(#clip0_5728_4755)">
            <path d="M1.22058 0.577271L0.1875 1.61035L6.94223 8.2856L0.266967 14.9609L1.22058 15.9145L7.89583 9.23921L14.5711 15.9145L15.5247 14.9609L8.84944 8.2856L15.6042 1.61035L14.5711 0.577271L7.89583 7.332L1.22058 0.577271Z" fill="#333333"/>
          </g>
          <defs>
            <clipPath id="clip0_5728_4755">
              <rect width="15.4167" height="15.3372" fill="white" transform="translate(0.1875 0.577271)"/>
            </clipPath>
          </defs>
        </svg>

      </button>
    </>
  )
};

export default SearchInput