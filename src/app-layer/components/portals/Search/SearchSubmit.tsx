import React from 'react';
import useSearch from '../../../context/search/useSearch';
import getRoute from '../../../../scripts/utils/getRoute';

interface ISearchInputComponent {
  dataSet: DOMStringMap;
}

const SearchSubmit: React.FC<ISearchInputComponent> = ({
  dataSet,
}): JSX.Element => {
  const { submitText } = dataSet;

  const { quickSearchTerm, quickSearchResultsProducts } = useSearch();

  if (
    !quickSearchTerm ||
    !quickSearchResultsProducts ||
    quickSearchResultsProducts.length < 1
  ) {
    return null;
  }
  // const text = submitText.replace(/\[\[terms\]\]/g, `${quickSearchResultsProducts.length}`)
  return (
    <>
      <a
        className="btn btn--search btn--lg btn--primary"
        href={`${getRoute()}search?q=${quickSearchTerm.replace(/ /g, '+')}`}
      >
        {submitText.replace(/\[\[terms\]\]/g, quickSearchTerm)}
      </a>
      {/* <a className="btn btn--search btn--lg btn--secondary" href={`${getRoute()}search?q=${quickSearchTerm.replace(/ /g, '+')}`}>{ text.replace(/['"]+/g, '')}</a> */}
    </>
  );
};

export default SearchSubmit;
