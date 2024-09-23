import React from 'react'
import useSearch, { SORT_TYPE_VALS } from '../../../context/search/useSearch'
import useLangStrings from '../../../hooks/useLangStrings'

interface Props {
  dataSet: DOMStringMap;
}

const SearchSortBy: React.FC<Props> = ({ dataSet }: Props): JSX.Element => {

  const langStrings = useLangStrings(dataSet.langStrings)

  const { inputEventHandlers } = useSearch()
  return (
    <>
      <select className="select" defaultValue='null' onChange={ (e) => inputEventHandlers.handleSortByChange(e.target.value) }>
        <option value='null' disabled hidden>{langStrings.sort_button}</option>
        {SORT_TYPE_VALS.map((val, i) => (
          langStrings[val] ? <option key={i} value={val} className={val.replace(/_/g, '-')}>{langStrings[val]}</option> : null
        ))}
      </select>
    </>
  )
}

export default SearchSortBy
