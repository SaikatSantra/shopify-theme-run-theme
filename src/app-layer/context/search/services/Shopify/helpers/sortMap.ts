import FILTER_SEARCH from '../../../consts';

const { SORT_TYPES } = FILTER_SEARCH;

const sortMap = {
  [SORT_TYPES.RELEVANCE]: 'relevance-ascending',
  [SORT_TYPES.BEST_SELLING]: 'best-selling',
  [SORT_TYPES.PRICE_ASC]: 'price-ascending',
  [SORT_TYPES.PRICE_DESC]: 'price-descending',
  [SORT_TYPES.NAME_ASC]: 'title-ascending',
  [SORT_TYPES.NAME_DESC]: 'title-descending',
  [SORT_TYPES.NEW_ARRIVAL_ASC]: 'created-ascending',
  [SORT_TYPES.NEW_ARRIVAL_DESC]: 'created-descending'
};

export default sortMap;
