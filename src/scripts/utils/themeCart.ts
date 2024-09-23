import getCurrencyRoute from './getCurrencyRoute';

'use strict';

export {};

declare global {
  interface Window {
    Shopify: any;
  }
}

interface ICartUpdateByKey {
  quantity?: number;
  properties?: Record<string, any>
  sellingPlan?: number;
}
interface ICartAttributes {
    [key: string]: any
}

function getDefaultRequestConfig() {
  return JSON.parse(
    JSON.stringify({
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
      }
    })
  );
}

function fetchJSON(url, config) {
  return fetch(url, config).then(function(response) {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function cart() {
  return fetchJSON(getCurrencyRoute('cart.js'), getDefaultRequestConfig());
}

function cartAdd(id, quantity, properties, sellingPlan?) {
  const config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify({
    id: id,
    quantity: quantity,
    properties: properties,
    selling_plan: sellingPlan
  });

  return fetchJSON(getCurrencyRoute('cart/add.js'), config);
}

function cartAddFromForm(formData) {
  const config = getDefaultRequestConfig();
  delete config.headers['Content-Type'];

  config.method = 'POST';
  config.body = formData;

  return fetchJSON(getCurrencyRoute('cart/add.js'), config);
}

function cartChange(line, options) {
  const config = getDefaultRequestConfig();

  options = options || {};

  config.method = 'POST';
  config.body = JSON.stringify({
    line: line,
    quantity: options.quantity,
    properties: options.properties
  });

  return fetchJSON(getCurrencyRoute('cart/change.js'), config);
}

function cartClear() {
  const config = getDefaultRequestConfig();
  config.method = 'POST';

  return fetchJSON(getCurrencyRoute('cart/clear.js'), config);
}

function cartUpdate(body) {
  const config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify(body);

  return fetchJSON(getCurrencyRoute('cart/update.js'), config);
}

function cartShippingRates() {
  return fetchJSON(getCurrencyRoute('cart/shipping_rates.json'), getDefaultRequestConfig());
}

function key(key) {
  if (typeof key !== 'string' || key.split(':').length !== 2) {
    throw new TypeError(
      'Theme Cart: Provided key value is not a string with the format xxx:xxx'
    );
  }
}

function quantity(quantity) {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    throw new TypeError(
      'Theme Cart: An object which specifies a quantity or properties value is required'
    );
  }
}

function id(id) {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new TypeError('Theme Cart: Variant ID must be a number');
  }
}

function properties(properties) {
  if (typeof properties !== 'object') {
    throw new TypeError('Theme Cart: Properties must be an object');
  }
}

function form(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
  }
}

function options(options) {
  if (typeof options !== 'object') {
    throw new TypeError('Theme Cart: Options must be an object');
  }

  if (
    typeof options.quantity === 'undefined' &&
    typeof options.properties === 'undefined'
  ) {
    throw new Error(
      'Theme Cart: You muse define a value for quantity or properties'
    );
  }

  if (typeof options.quantity !== 'undefined') {
    quantity(options.quantity);
  }

  if (typeof options.properties !== 'undefined') {
    properties(options.properties);
  }
}

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

/**
 * Returns the state object of the cart
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function getState(): Promise<any>  {
  return cart();
}

/**
 * Returns the index of the cart line item
 * @param {string} key The unique key of the line item
 * @returns {Promise} Resolves with the index number of the line item
 */
export function getItemIndex(key$$1: string): Promise<number> {
  key(key$$1);

  return cart().then(function(state) {
    let index = -1;

    state.items.forEach(function(item, i) {
      index = item.key === key$$1 ? i + 1 : index;
    });

    if (index === -1) {
      return Promise.reject(
        new Error('Theme Cart: Unable to match line item with provided key')
      );
    }

    return index;
  });
}

/**
 * Fetches the line item object
 * @param {string} key The unique key of the line item
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export function getItem(key$$1: string): Promise<any> {
  key(key$$1);

  return cart().then(function(state) {
    let lineItem = null;

    state.items.forEach(function(item) {
      lineItem = item.key === key$$1 ? item : lineItem;
    });

    if (lineItem === null) {
      return Promise.reject(
        new Error('Theme Cart: Unable to match line item with provided key')
      );
    }

    return lineItem;
  });
}

/**
 * Add a new line item to the cart
 * @param {number} id The variant's unique ID
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export function addItem(id$$1: number, options$$1?: ICartUpdateByKey): Promise<any> {
  options$$1 = options$$1 || {};

  id(id$$1);

  return cartAdd(id$$1, options$$1.quantity, options$$1.properties, options$$1.sellingPlan);
}

/**
 * Add a new line item to the cart from a product form
 * @param {object} form DOM element which is equal to the <form> node
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addItemFromForm(form$$1: any): Promise<any> {
  form(form$$1);

  const formData = new FormData(form$$1);
  const entryValue = formData.get('id');
  if (!(entryValue instanceof File)) {
    id(parseInt(entryValue, 10));
    return cartAddFromForm(formData);
  }
  return getState()
}

/**
 * Changes the quantity and/or properties of an existing line item.
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function updateItem(key$$1: string, options$$1: ICartUpdateByKey): Promise<any> {
  key(key$$1);
  options(options$$1);

  return getItemIndex(key$$1).then(function(line) {
    return cartChange(line, options$$1);
  });
}

/**
 * Removes a line item from the cart
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function removeItem(key$$1: string): Promise<any> {
  key(key$$1);

  return getItemIndex(key$$1).then(function(line) {
    return cartChange(line, { quantity: 0 });
  });
}

/**
 * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function clearItems(): Promise<any> {
  return cartClear();
}

/**
 * Gets all cart attributes
 * @returns {Promise} Resolves with the cart attributes object
 */
export function getAttributes(): Promise<any> {
  return cart().then(function(state) {
    return state.attributes;
  });
}

/**
 * Sets all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export function updateAttributes(attributes: ICartAttributes): Promise<any> {
  return cartUpdate({ attributes: attributes });
}

/**
 * Clears all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export function clearAttributes(): Promise<any> {
  return getAttributes().then(function(attributes) {
    for (const key$$1 in attributes) {
      attributes[key$$1] = '';
    }
    return updateAttributes(attributes);
  });
}

/**
 * Gets cart note
 * @returns {Promise} Resolves with the cart note string
 */
export function getNote(): Promise<any> {
  return cart().then(function(state) {
    return state.note;
  });
}

/**
 * Sets cart note
 * @returns {Promise} Resolves with the cart state object
 */
export function updateNote(note: string): Promise<any> {
  return cartUpdate({ note: note });
}

/**
 * Clears cart note
 * @returns {Promise} Resolves with the cart state object
 */
export function clearNote(): Promise<any> {
  return cartUpdate({ note: '' });
}

/**
 * Get estimated shipping rates.
 * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
 */
export function getShippingRates(): Promise<any> {
  return cartShippingRates();
}