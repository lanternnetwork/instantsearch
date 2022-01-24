import { panel, toggleRefinement } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from '../templates/panel';

const freeShippingToggleRefinement = panel({
  templates: {
    header: 'Free shipping',
    collapseButtonText,
  },
  collapsed: () => false,
})(toggleRefinement);

export const freeShipping = (container = '[data-widget="free-shipping"]') =>
  freeShippingToggleRefinement({
    container,
    attribute: 'free_shipping',
    templates: {
      labelText: 'Display only items with free shipping',
    },
  });
