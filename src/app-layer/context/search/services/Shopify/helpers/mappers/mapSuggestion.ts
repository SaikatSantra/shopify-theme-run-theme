import { IQuickSearchResultSuggestion } from '../../../../types';
import { IPredSearchQuery } from '../../types';
import buildSuggestionQuery from '../buildSuggestionQuery';

const mapSuggestion = (queryInResp: IPredSearchQuery): IQuickSearchResultSuggestion => {
  return {
    value: queryInResp.text,
    query: buildSuggestionQuery(queryInResp.url)
  };
};

export default mapSuggestion;
