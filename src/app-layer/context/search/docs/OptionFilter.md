# Option Filters

When using Vertical layout it's important to uncomment the code in the following files.

src/app-layer/components/portals/Search/Components/FilterTypes/SingleOptionFilter.tsx
src/app-layer/components/portals/Search/Components/FilterTypes/MultiOptionFilter.tsx
src/app-layer/components/portals/Search/Components/FilterTypes/RangeOptionFilter.tsx

This code may need some adjustement (for example it may not be desktop only that you want them to auto-select)

There are also some CSS settings related to the Clear/Apply buttons

These can be found in src/styles/components/_filter.scss under the `&__clear-apply` selector