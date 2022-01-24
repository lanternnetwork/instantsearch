import { panel, rangeSlider } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from '../templates/panel';

const priceRangeSlider = panel({
  templates: {
    header: 'Price',
    collapseButtonText,
  },
  collapsed: () => false,
})(rangeSlider);

export const priceSlider = (container = '[data-widget="price-range"]') =>
  priceRangeSlider({
    container,
    attribute: 'price',
    pips: false,
    tooltips: {
      format(value) {
        return `${Math.round(value).toLocaleString()}`;
      },
    },
  });
