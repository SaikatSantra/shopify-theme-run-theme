import {ISearchService} from './types';

/**
 * Import the appropriate search provider server here based on store configuration
 */


// TODO: Implement dynamic import?

// let servicePath

// switch(window['blubolt'].SearchService) {
//   case 'klevu':
//     servicePath = './services/Klevu';
//     break;
//   case 'boostcommerce':
//     servicePath = './services/BoostCommerce';
//     break;
//   case 'shopify':
//     servicePath = './services/Shopify';
//     break;

// }

// const Service = import(servicePath);


// import Service from './services/Klevu';
// import Service from './services/BoostCommerce';
import Service from './services/Shopify';

const SearchService: ISearchService = {
  methods: {
    handleSearch: Service.methods.handleSearch,
    getFilters: Service.methods.getFilters,
    getProductResults: Service.methods.getProductResults,
    getCmsContent: Service.methods.getCmsContent,
    getSwatchData: Service.methods.getSwatchData,
  },
}

export default SearchService
