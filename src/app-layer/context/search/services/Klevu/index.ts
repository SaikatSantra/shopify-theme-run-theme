import HandleSearch from './methods/HandleSearch';
import {ISearchService} from '../../types';
import GetFilters from './methods/GetFilters';
import GetProductResults from './methods/GetProductResults';
import GetCmsContent from './methods/GetCmsContent';

const Klevu: ISearchService = {
  methods: {
    handleSearch: HandleSearch,
    getFilters: GetFilters,
    getProductResults: GetProductResults,
    getCmsContent: GetCmsContent
  }
}

export default Klevu