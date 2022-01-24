import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import {
  brands,
  categories,
  clearFilters,
  clearFiltersEmptyResults,
  clearFiltersMobile,
  configuration,
  freeShipping,
  hitsPerPage,
  pagination,
  priceSlider,
  products,
  ratings,
  resultsNumberMobile,
  saveFiltersMobile,
  searchBox,
  sortBy,
} from './widgets';
import { dynamicWidgets } from 'instantsearch.js/es/widgets';
import getRouting from './routing';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  searchClient,
  indexName: 'instant_search',
  routing: getRouting({ indexName: 'instant_search' }),
});

search.addWidgets([
  clearFilters,
  clearFiltersEmptyResults,
  clearFiltersMobile,
  configuration,
  dynamicWidgets({
    container: '[data-widget="filters"]',
    widgets: [brands, categories, freeShipping, priceSlider, ratings],
  }),
  hitsPerPage,
  pagination,
  products,
  resultsNumberMobile,
  saveFiltersMobile,
  searchBox,
  sortBy,
]);

export default search;
