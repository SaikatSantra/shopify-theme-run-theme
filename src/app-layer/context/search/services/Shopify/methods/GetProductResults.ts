import {
  IActiveCollection,
  IGetProductsResult,
  IGetProductsResultsQuery,
  ISearchFilter,
} from "../../../types";
import getTemplateJSON from "../../../../../../scripts/utils/getTemplateJSON";
import mapFilters from "../helpers/mappers/mapFilters";
import {
  ICollTemplateResponse,
  ISearchTemplateResponse,
  ITemplateProductResponse,
} from "../types";
import mapProduct from "../helpers/mappers/mapProduct";
import getFilteredUrlParams from "../helpers/getFilteredUrlParams";
import getSortKeyParams from "../helpers/getSortKeyParams";

const GetProductResults = async (
  searchFilters: ISearchFilter[],
  activeCollection: IActiveCollection,
  query: IGetProductsResultsQuery,
): Promise<IGetProductsResult> => {
  const mappedResponse: IGetProductsResult = {
    records: 0,
    total: 0,
    products: [],
    filters: [],
  };

  try {
    const pageIndex: number = query.pageIndex || 1;

    let urlParams = getFilteredUrlParams(searchFilters);
    urlParams += getSortKeyParams(query);

    let templateData: ICollTemplateResponse | ISearchTemplateResponse;
    let productsInResponse: ITemplateProductResponse[];

    // If the query term is empty here, we're on a collection page, otherwise we're on the search page.

    if (query.term === "") {
      templateData = await getTemplateJSON<ICollTemplateResponse>(
        "collections",
        activeCollection.handle,
        "sf-data",
        `&page=${pageIndex}${urlParams}`,
      );

      productsInResponse = templateData.products;
    } else {
      urlParams += `&q=${query.term}&type=product`;

      templateData = await getTemplateJSON<ISearchTemplateResponse>(
        "search",
        "",
        "sf-data",
        `&page=${pageIndex}${urlParams}`,
      );

      productsInResponse = templateData.searchResults;
    }

    // Total is the total number of products returned after the filters applied, before pagination.
    // Records is the number of products on the page.

    mappedResponse.total = templateData.resultsCount;
    mappedResponse.records = productsInResponse.length;
    mappedResponse.filters = mapFilters(templateData.filters);
    mappedResponse.products = productsInResponse.map((product, index: number) =>
      mapProduct(product, index, pageIndex),
    );

    return mappedResponse;
  } catch (e) {
    throw new Error(`Error when getting product results from Shopify: ${e}`);
  }
};

export default GetProductResults;
