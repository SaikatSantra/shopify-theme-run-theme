# Filter & Search

This context allows you to aggregate the data retrieved from filter & search providers (such as Shopify, Klevu, BoostCommerce, Algolia etc) into a format universally understood by BluBolt. Allowing for us to standardise our filter & search components regardless of the provider.

## Implementing a new Search Provider

On a high level, each service needs 4 methods, verify that most of this data is available from the third party API before looking at implementing. Optionally, settings can be sent over to these methods from the setting block in the theme. We don't need everything from this list.

* HandleSearch - for Quick Search
  * Products
  * Collections
  * Pages
  * Articles
  * Suggestions
  * Typos
* GetProductResults - gets products with available filters. Parameters that are to be passed over to the API are also built here. Called from both collections and search. The page index is passed into this so we can request the correct page from the API
  * Products
  * Filters
* GetFilters
  * Filters
* GetCmsContent
  * Pages
  * Articles

All of this data needs to be mapped to the correct types for the UI.

Also add a new sort by langstring snippet for the new provider. Check snippets/search-sort-by.liquid for an example.

## Configuration

Search provider configuration is handled in the `theme/sections/footer-scripts.liquid` file.

These settings are surfaced to Shopify.

![Theme settings](https://user-images.githubusercontent.com/24208175/110918529-2dbe5e00-8313-11eb-8003-07e40ee4dc56.png)

### Switching the Search Provider

1. Import the correct service in SearchService.ts
2. Change the Filter & Search Service Provider in the App Layer settings in the customiser
3. Add a config block (if not present) under App Layer and configure
4. In Theme Settings, under Integrations, make sure Enable baseline filters is on and also change the Filters Sort Strings setting to the correct service. Since not every service supports the same sorting methods, we have snippets for each service to control what's displayed in the Sort By element. We need a theme setting for this instead of a section / block so this is why it is in a different location.

### Switching the Filter Layout

Within `main-collection.liquid` you can switch between Button, Horizontal and Vertical layouts. These will have been defined in designs so shouldn't need to be adjusted on the fly.

### Shopify

The Shopify service is enabled by default. It uses JSON data templates returned by Liquid for the data. Search for *.sf-data.liquid and sf-*.liquid to find these.
If these are modified / extended, make sure types are added for them in Shopify/types.ts.

For Quick Search, the Predictive Search API (<https://shopify.dev/docs/api/ajax/reference/predictive-search>) is used.

The displayed filters are set in the Shopify Search & Discovery app.

#### Gotchas

* Shopify only supports relevance and price sorting on the search page / template. The other ones are hidden via CSS. This lives in footer-scripts.liquid
* Metafields need to be explicitly called in the template. Looping over all of them is not possible. See sf-product-metafields.liquid

#### TODO

* Make the rating filter use the RatingFilter component instead of MultiOptionFilter
* Possibly look into changing the service dynamically in SearchService.ts using a theme setting

#### Backporting for old clients

Roughly this is how it's done, but check the PR.

1. Add all sf-data templates and snippets
    * search.sf-data.liquid
    * collection.sf-data.liquid
    * sf-product.liquid
    * sf-product-variants.liquid
    * sf-product-metafields.liquid
    * sf-page.liquid
    * sf-filter.liquid
    * sf-article.liquid
2. Add shopify-sort-by-lang-strings-json.liquid to snippets
    * Update langstrings to use theme settings instead of hardcoded values
3. Update snippets/search-sort-by.liquid
4. Add lang strings snippets for Boost and Klevu
    * boost-sort-by-lang-strings-json.liquid
    * klevu-sort-by-lang-strings-json.liquid
5. Add new settings and code to footer-scripts
6. Add new language strings to en.default.json
7. Add new settings to config/settings_schema.json
8. Update config/settings_data.json to use Shopify by default
9. Add new utils
    * queryStorefrontApi.ts (this is actually not used for this but good to have)
    * queryPredictiveSearchApi.ts
10. Update getTemplateJSON.ts
11. Remove unnecessary types from src/app-layer/util/typings.ts (template types)
12. Change all the search service method signatures so that config is the last one called in src/app-layer/context/search/useSearch.tsx
13. Update the method interfaces so that config is the last one and also optional in src/app-layer/context/search/types.d.ts
14. Add the whole folder of src/app-layer/context-search/services/Shopify
15. Change the method signatures in Klevu and Boost so that config is the last one
    * Klevu/methods/GetProductResults.ts
    * Klevu/methods/GetFilters.ts
    * BoostCommerce/methods/GetProductResults.ts
    * BoostCommerce/methods/GetFilters.ts
16. Add import statement for Shopify to SearchService.ts
17. Add className={val.replace(/_/g, '-')} to options in SearchSortBy,tsx
18. Replace document.body.classList.remove('filters-open') with handleModalClose(['filters-open']) in all the filters (to fix a bug)
    * SingleOptionFilter.tsx
    * RangeOptionFilter.tsx
    * MultiOptionFilter.tsx
    * etc
19. Add the unit tests from tests/js

### Boost specific setup

1. Install the boost app on the site. You can do this on a random theme (eg a copy of Dawn or whatever) and ignore the files it adds, we don't need them in our theme.
1. In `app-layer/context/search/SearchService.ts` make sure that the boost search service is the only service imported.
1. In the theme settings make sure you enable `Baseline filters` in the general theme settings (under integrations).
1. In the theme section settings, under App layer, select BoostCommerce from the dropdown.
1. Add a block of type `Filter & Search [Boost]`.
    * In here, the API key is always the store url, eg `blubolt-demo.myshopify.com`
    * The API endpoint is always: `https://services.mybcapps.com/bc-sf-filter` unless told otherwise by the Boost team.
    * The rest of this configuration can be adjusted depending on the designs.
1. Go set up a filter tree inside the boost app. 🧸 Bear in mind 🧸 that officially our integration **only supports one filter tree**. Please disable the search filter tree so that search uses the same filter tree as the collection pages.
1. You should now have working filters on the collection page! 🙌
1. Customise the product card. There are two product card templates. Once liquid, once tsx. You must make sure that these render the same, or as close as possible. It may be that some things you can render on the product card in liquid aren't available on the react product card. Standardly, the card renders 2 images, the title, the price and a quick add button. The two custom features that are available out of the box are simple product card swatches, and product stickers. Anything else must be scoped out as custom work.
1. Style the **dummmy** product card. There is a dummy product card that exists in both liquid and jsx. This must be styled in a way that it takes up the same amount of screen space as the real product card. This is used as a loading state so ensures that there is minimal layout shift during navigation and filtering. **This is very important**. It is reccomended to fix the aspect ratio of the dummy "image" and to fix the heights of the info/text area of the product card.

#### A note on boost settings

There is a mixture of settings that you see in the boost app - some functional/data some display. As a general rule the settings that refer to layout/colour are correspond to the Boost app's own integration and **not** our API integration. For instance layout options in the boost app are non-effective, layout is controlled in the theme. However the data that is set up in the filter tree is refleceted on the front. An exception is the custom sort options in boost - they are not (yet) supported. Boost is adding more functionality all the time and extra integration may be needed to support these new features.

####

### Klevu

TODO: Klevu isn't currently fully integrated.


## Context

The `useSearch` context provides you with hooks you may need to build a search interface. Examples of usage can been seen in the portal components.

All hooks have by typed so you can easily see whats available to you in your IDE.

### searchTerm

This hook provides you with search term entered by the user

### quickSearchResult

This hook provides you with the high level search result after it has been data shaped.

It also includes a `raw` attribute which you may use if you require something specific to your build. Please note however, if you are using raw data - please consider if it is something that would translate across all providers. If it is then it should be patched into the core data shaping methods.

### quickSearchResultsTypos

The hook provides you with an array of `IQuickSearchResultTypo` records if the search provider implements them.

### quickSearchResultsSuggestions

The hook provides you with an array of `IQuickSearchResultSuggestion` records if the search provider implements them.

### quickSearchResultsProducts

The hook provides you with an array of `ISearchAndFilterProducts` records if the search provider implements them.

### quickSearchResultsCollections

The hook provides you with an array of `IQuickSearchResultCollection` records if the search provider implements them.

### searchFilters

The hook provides you with an array of `ISearchFilter` records - these are the filters to display on a collection or search results page.

### searchFilters

The hook provides you with an array of `ISearchFilter` records - these are the filters to display on a collection or search results page.

### productSearchResult

The hook provides you with the product search results after it has been data shaped. For use rendering the filtered collection page, or as search results page.

### productSearchResultsState

Above, but indexed to page number. Acts as a "cache" for pagination so that a new request isn't required when visiting previosuly loaded paginated pages.

## Filter & Search Components

A set of standardised components have been provided as a portal which you can either use as is or modify to your needs.

### Search

#### SearchInput

`app-layer/components/portals/Search/SearchInput.tsx`

The component used to handle text input from the user.

You may include this component in the site by using the `search-input.liquid` snippet

#### SearchResultsSuggestions

`app-layer/components/portals/Search/SearchResultsSuggestions.tsx`

This component renders any suggestions returned by the search provider.

You may include this component in the site by using the `search-results-suggestions.liquid` snippet

#### SearchResultsProducts

`app-layer/components/portals/Search/SearchResultsProducts.tsx`

This component renders any products returned by the search provider.

You may include this component in the site by using the `search-results-products.liquid` snippet

#### SearchResultsCollections

`app-layer/components/portals/Search/SearchResultsCollections.tsx`

This component renders any collections returned by the search provider.

You may include this component in the site by using the `search-results-collections.liquid` snippet

#### SearchFilterCount

`app-layer/components/portals/Search/SearchFilterCount.tsx`

This component renders the count of selected filters.

You may include this component in the site by using an element with `data-app-layer-portal="search-filter-count"` data attribute.

#### SearchFilteredProducts

`app-layer/components/portals/Search/SearchFilteredProducts.tsx`

This component renders the product cards from the search results or the filtered collection.

You may include this component in the site by using the `search-filtered-products.liquid` snippet

#### SearchFilters

`app-layer/components/portals/Search/SearchFilters.tsx`

This component renders the filter list.

You may include this component in the site by using the `search-filters` snippet

#### SearchSortBy

`app-layer/components/portals/Search/SearchSortBy.tsx`

This component renders the sort by drop down

You may include this component in the site by using the `search-sort-by` snippet.
