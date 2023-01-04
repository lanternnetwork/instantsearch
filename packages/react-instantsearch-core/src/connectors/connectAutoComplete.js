import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';
import { addQueryID, addAbsolutePositions } from '../core/utils';

const getId = () => 'query';

function getCurrentRefinement(props, searchState, context) {
  const id = getId();
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    id,
    ''
  );

  if (currentRefinement) {
    return currentRefinement;
  }
  return '';
}

function getHits(searchResults) {
  if (searchResults.results) {
    if (
      searchResults.results.hits &&
      Array.isArray(searchResults.results.hits)
    ) {
      return addAbsolutePositions(
        addQueryID(searchResults.results.hits, searchResults.results.queryID),
        searchResults.results.hitsPerPage,
        searchResults.results.page
      );
    } else {
      return Object.keys(searchResults.results).reduce(
        (hits, index) => [
          ...hits,
          {
            index,
            hits: addAbsolutePositions(
              addQueryID(
                searchResults.results[index].hits,
                searchResults.results[index].queryID
              ),
              searchResults.results[index].hitsPerPage,
              searchResults.results[index].page
            ),
          },
        ],
        []
      );
    }
  } else {
    return [];
  }
}

function refine(props, searchState, nextRefinement, context) {
  const id = getId();
  const nextValue = { [id]: nextRefinement };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage);
}

function cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, getId());
}

/**
 * connectAutoComplete connector provides the logic to create connected
 * components that will render the results retrieved from
 * Algolia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * prop to a [Configure](guide/Search_parameters.html) widget.
 * @name connectAutoComplete
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {function} refine - a function to change the query
 * @providedPropType {string} currentRefinement - the query to search for
 */
export default createConnector({
  displayName: 'AlgoliaAutoComplete',
  $$type: 'ais.autoComplete',

  getProvidedProps(props, searchState, searchResults) {
    return {
      hits: getHits(searchResults),
      currentRefinement: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue,
      }),
    };
  },

  refine(props, searchState, nextRefinement) {
    return refine(props, searchState, nextRefinement, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  cleanUp(props, searchState) {
    return cleanUp(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(
      getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue,
      })
    );
  },
});
