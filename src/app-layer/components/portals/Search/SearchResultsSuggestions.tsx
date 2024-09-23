import React from 'react'
import useSearch from '../../../context/search/useSearch';
import getRoute from '../../../../scripts/utils/getRoute'
import { Interweave } from 'interweave';


interface ISearchResultsSuggestionsComponent {
  dataSet: DOMStringMap
}

const SearchResultsSuggestions: React.FunctionComponent<ISearchResultsSuggestionsComponent> = ({ dataSet }): JSX.Element => {

  const {
    langTitle
  } = dataSet

  const {quickSearchResultsSuggestions } = useSearch()

  // const handleOnClickSuggestion = (index) => eventHandlers.handleSearchSuggestionSelected(index)

  if (quickSearchResultsSuggestions && !quickSearchResultsSuggestions.length) return null

  return (
    <div className={`search__results search__results--list search__results--suggestions ${(quickSearchResultsSuggestions && quickSearchResultsSuggestions.length) && 'search__results--loaded'}`}>
      {(quickSearchResultsSuggestions && quickSearchResultsSuggestions.length) && <>
        <div className={'search__results-title search__results-title--suggestions heading-5'}>{langTitle}</div>
        <div className={'search__results-list search__results-list--suggestions'}>
          <ul>
            {quickSearchResultsSuggestions.map((suggestion, index) => {
              return (
                <li className={'search__results-item search__results-item--suggestions'} key={index}>
                  <a href={`${getRoute()}search?q=${suggestion.query}`}> <Interweave content={suggestion.value} noWrap={true} /> </a>
                </li>
              )
            })}
          </ul>
        </div>
      </>}
    </div>
  )
}

export default SearchResultsSuggestions