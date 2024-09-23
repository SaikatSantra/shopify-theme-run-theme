export {};

declare global {
  interface Window {
    Shopify: any;
  }
}

const getRoute = (stripped = false): string => {
  if (window.Shopify.routes.root) {
    return stripped ? (window.Shopify.routes.root.split('/')[1] ? window.Shopify.routes.root.split('/')[1] : '/') : window.Shopify.routes.root;
  } else {
    return '/'
  }
}

export default getRoute