import { Hit as AlgoliaHit } from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import React, { useEffect } from 'react';
import {
  InstantSearch,
  Breadcrumb,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  Highlight,
  Hits,
  HitsPerPage,
  InfiniteHits,
  Menu,
  Pagination,
  RangeInput,
  RefinementList,
  PoweredBy,
  SearchBox,
  SortBy,
  ToggleRefinement,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';

import {
  Panel,
  QueryRuleContext,
  QueryRuleCustomData,
  Refresh,
} from './components';
import { Tab, Tabs } from './components/layout';

import './App.css';
import { override } from './override-method';

let shouldThrowError = false;
const searchClient = override(
  algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  'search',
  async (search, ...args) => {
    if (shouldThrowError) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      throw new Error(
        `An error occurred in query ${args[0][0].params!.query}!`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return search(...args);
  }
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

function ErrorMaker() {
  const [error, setError] = React.useState(shouldThrowError);

  useEffect(() => {
    shouldThrowError = error;
  }, [error]);

  return (
    <button type="button" onClick={() => setError(!error)}>
      {error ? 'disable' : 'enable'} erroring
    </button>
  );
}

function ErrorToast() {
  const { status, error } = useInstantSearch({ catchError: true });

  if (error) {
    return (
      <div
        style={{
          background: 'salmon',
          color: 'white',
          padding: '1em',
          fontWeight: 'bold',
        }}
      >
        status: {status}, {error?.message}
      </div>
    );
  }

  return null;
}

export function App() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="instant_search"
      routing={true}
    >
      <Configure ruleContexts={[]} />

      <ErrorMaker />
      <div className="Container">
        <div>
          <DynamicWidgets>
            <Panel header="Brands">
              <RefinementList
                attribute="brand"
                searchable={true}
                searchablePlaceholder="Search brands"
                showMore={true}
              />
            </Panel>
            <Panel header="Categories">
              <Menu attribute="categories" showMore={true} />
            </Panel>
            <Panel header="Hierarchy">
              <HierarchicalMenu
                attributes={[
                  'hierarchicalCategories.lvl0',
                  'hierarchicalCategories.lvl1',
                  'hierarchicalCategories.lvl2',
                ]}
                showMore={true}
              />
            </Panel>
            <Panel header="Price">
              <RangeInput attribute="price" />
            </Panel>
            <Panel header="Free Shipping">
              <ToggleRefinement
                attribute="free_shipping"
                label="Free shipping"
              />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="Search">
          <Breadcrumb
            attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
            ]}
          />

          <SearchBox placeholder="Search" />
          <ErrorToast />

          <div className="Search-header">
            <PoweredBy />
            <HitsPerPage
              items={[
                { label: '20 hits per page', value: 20, default: true },
                { label: '40 hits per page', value: 40 },
              ]}
            />
            <SortBy
              items={[
                { label: 'Relevance', value: 'instant_search' },
                { label: 'Price (asc)', value: 'instant_search_price_asc' },
                { label: 'Price (desc)', value: 'instant_search_price_desc' },
              ]}
            />
            <Refresh />
          </div>

          <div className="CurrentRefinements">
            <ClearRefinements />
            <CurrentRefinements
              transformItems={(items) =>
                items.map((item) => {
                  const label = item.label.startsWith('hierarchicalCategories')
                    ? 'Hierarchy'
                    : item.label;

                  return {
                    ...item,
                    attribute: label,
                  };
                })
              }
            />
          </div>

          <QueryRuleContext
            trackedFilters={{
              brand: () => ['Apple'],
            }}
          />

          <QueryRuleCustomData>
            {({ items }) => (
              <>
                {items.map((item) => (
                  <a href={item.link} key={item.banner}>
                    <img src={item.banner} alt={item.title} />
                  </a>
                ))}
              </>
            )}
          </QueryRuleCustomData>

          <Tabs>
            <Tab title="Hits">
              <Hits hitComponent={Hit} />
              <Pagination className="Pagination" />
            </Tab>
            <Tab title="InfiniteHits">
              <InfiniteHits showPrevious hitComponent={Hit} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </InstantSearch>
  );
}
