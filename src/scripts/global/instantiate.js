const ready = (instantiate) => {
  document.addEventListener("DOMContentLoaded", () => {
    instantiate();
  });
};
const onShopifySectionLoad = (run) => {
  //
  // Shopify Event instantiation
  // ----------------------------
  const shopifyEvents = ["shopify:section:load"];
  shopifyEvents.forEach((event) => {
    document.addEventListener(event, () => run(event));
  });
};
export { ready, onShopifySectionLoad };
