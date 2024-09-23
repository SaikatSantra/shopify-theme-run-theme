// https://shopify.dev/docs/api/ajax/reference/predictive-search.
// Returns up to 10 results.
import getCurrencyRoute from './getCurrencyRoute';

const queryPredictiveSearchApi = async <T>(query: string): Promise<T> => {
  const options = 'resources[limit_scope]=each&resources[limit]=3';
  const path = `search/suggest.json?q=${query}&${options}`;

  try {
    const apiResponse: Response = await fetch(getCurrencyRoute(path));
    return await apiResponse.json();
  } catch (e) {
    throw new Error(`Predictive Search API query failed with error: ${e}`);
  }
};

export default queryPredictiveSearchApi;
