import { IQuickSearchResultCollection } from '../../../../types';
import { IPredSearchCollection } from '../../types';

const mapCollection = (collInResponse: IPredSearchCollection): IQuickSearchResultCollection => {
  return {
    id: collInResponse.id.toString(),
    handle: collInResponse.handle,
    title: collInResponse.title,
    url: collInResponse.url
  };
};

export default mapCollection;
