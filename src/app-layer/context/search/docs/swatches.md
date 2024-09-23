# Product Swatches

Product Swatches are managed in multiple places and the setup is quite frustrating.

For Shopify to do native Swatch filtering the setup needs to match - https://help.shopify.com/en/manual/online-store/search-and-discovery/filters#visual-filters

That can be as simple as a title, and a colour (and/or image) field. However previously we have had native multi-colour filtering, so I have added the "colours" field which is a list of color values.

The way this works is that it gets each of the colours from that list and generates an SVG. At present it only does 2 colours but I think 3 and 4 could be added easily.

If using Shopify and the product swatch metafield is named something other than "swatch" then the conditional on src/app-layer/context/search/services/Shopify/helpers/mappers/mapFilters.ts line 24 `filterInResp.id.includes('swatch')` - will need to be updated

--

For displaying the swatches in liquid this is in theme-base/snippets/product-swatches.liquid

--

For react land it's in multiple places

Firstly for the product card, the data comes from theme-base/snippets/sf-product-metafields.liquid

The markup to generate the swatch logic almost matches product-swatches.liquid but with a few minor tweaks

--

This is then rendered within src/app-layer/components/portals/Search/Components/SearchProductSwatches.tsx

--

For the filter itself the data comes from theme-base/layout/theme.liquid, window.swatches object

This data is then processed by src/app-layer/context/search/helpers/GetSwatchData.ts

Finally, the swatch is generated within src/app-layer/components/portals/Search/Components/FilterDisplayTypes/SwatchFilter.tsx
