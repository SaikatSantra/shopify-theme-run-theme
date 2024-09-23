import getCurrencyRoute from './getCurrencyRoute';
/*
  This can be used to get extra data from a Liquid template that returns JSON.

  Example use cases:
    - products/${handle}.js does not include metafields, so we build and get the data this way.

  Implementation examples:

  (async () => {
    interface IExampleCollType {
      handle: string;
      title: string;
    }

    interface IExampleCollProductType {
      title: string;
    }

    interface IExampleProductType {
      metafields: any;
    }

    // Using collection.json-data.liquid for the data.
    console.log(await getTemplateJSON<IExampleCollType>('collections', 'all', 'json-data'));

    // Using a different template
    // In this case the data would come from collection.json-products.liquid.
    // Optionally, pass in params.
    console.log(
      await getTemplateJSON<IExampleCollProductType[]>('collections', 'all', 'json-products', '&page=2');
    );

    // Getting a single product's data in product.json-data.liquid.
    console.log(await getTemplateJSON<IExampleProductType>('products', 'belgian-ipa', 'json-data'));
  })();
*/

const getTemplateJSON = async <T>(templatePath: string, handle: string, view: string, params?: string): Promise<T> => {
  try {
    let url = `${templatePath}/${handle}?view=${view}`;

    // The optional params must begin with '&'.
    if (params) {
      url += params;
    }

    const response: Response = await fetch(getCurrencyRoute(url));
    return await response.json();
  } catch (error) {
    throw new Error(`Error when fetching a template's json data: ${error}`);
  }
};

export default getTemplateJSON;
