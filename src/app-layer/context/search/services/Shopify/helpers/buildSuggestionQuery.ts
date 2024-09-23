const buildSuggestionQuery = (str: string): string => {
  const splitArr: string[] = str.split('&q=');
  const term: string = splitArr[1];
  const queryWithoutTerm: string = splitArr[0];

  return term + queryWithoutTerm.replace('/search?', '&');
};

export default buildSuggestionQuery;
