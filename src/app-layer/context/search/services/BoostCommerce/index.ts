import { ISearchService } from "../../types";
import HandleSearch from "./methods/HandleSearch";
import GetFilters from "./methods/GetFilters";
import GetProductResults from "./methods/GetProductResults";
import GetCmsContent from "./methods/GetCmsContent";
import GetSwatchData from "../../helpers/GetSwatchData";

const BoostCommerce: ISearchService = {
  methods: {
    handleSearch: HandleSearch,
    getFilters: GetFilters,
    getProductResults: GetProductResults,
    getCmsContent: GetCmsContent,
    getSwatchData: GetSwatchData,
  },
};

export default BoostCommerce;
