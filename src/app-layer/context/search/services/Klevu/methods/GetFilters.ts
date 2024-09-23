import KlevuApi from "../api";
import {
  IActiveCollection,
  IGetFiltersResult,
  ISearchProviderConfig,
} from "../../../types";
import mapFiltersFromResponse from "../helpers/mapFiltersFromResponse";

const GetFilters = (
  activeCollection: IActiveCollection,
  searchTerm: string | null,
  config: ISearchProviderConfig,
): Promise<IGetFiltersResult> =>
  new Promise<IGetFiltersResult>((resolve) => {
    const response: IGetFiltersResult = {
      raw: null,
      filters: [],
    };

    const getSearchTerm = (): string => {
      if (searchTerm) {
        return searchTerm;
      }
      if (activeCollection.handle) {
        return activeCollection.handle;
      }
      return "";
    };

    try {
      KlevuApi(config.apiKey, config.apiEndpoint)
        .request({
          recordQueries: [
            {
              settings: {
                query: {
                  term: getSearchTerm(),
                },
              },
              filters: {
                filtersToReturn: {
                  enabled: true,
                  rangeFilterSettings: [
                    {
                      key: "klevu_price",
                      minMax: true,
                    },
                  ],
                },
              },
            },
          ],
        })
        .then((res) => {
          // Set raw response
          response.raw = res.data;

          if (typeof res.data.queryResults[0].filters !== "undefined") {
            response.filters = mapFiltersFromResponse(res);
          }

          resolve(response);
        });
    } catch (e) {
      console.error(e);
      resolve(response);
    }
  });

export default GetFilters;
