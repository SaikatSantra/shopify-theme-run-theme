/*
  Example usage:

  (async () => {
    interface IExampleResponse {
      data: {
        shop: {
          name: string;
        }
      }
    }

    const query = `
      {
        shop {
          name
        }
      }
    `

    await queryStorefrontApi<IExampleResponse>(query);
  })();

  Handy tool for building more complex queries:
  https://shopify.dev/docs/custom-storefronts/building-with-the-storefront-api/api-exploration/graphiql-storefront-api
*/

interface ISfApiConfig {
  shop: string;
  apiVersion: string;
  accessToken: string;
}

const queryStorefrontApi = async <T>(query: string): Promise<T> => {
  const sfApiConfigStr: string = document.querySelector(
    "[data-storefront-api-config]",
  ).textContent;
  const sfApiConfig: ISfApiConfig = JSON.parse(sfApiConfigStr);

  const { shop, apiVersion, accessToken } = sfApiConfig;

  const url = `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`;

  const config = {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  };

  try {
    const apiResponse: Response = await fetch(url, config);
    return await apiResponse.json();
  } catch (e) {
    throw new Error(`Storefront API query failed with error: ${e}`);
  }
};

export default queryStorefrontApi;
