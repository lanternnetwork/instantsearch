import { panel, hierarchicalMenu } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from '../templates/panel';

const categoryHierarchicalMenu = panel({
  templates: {
    header: 'Category',
    collapseButtonText,
  },
  collapsed: () => false,
})(hierarchicalMenu);

export const categories = (container = '[data-widget="categories"]') =>
  categoryHierarchicalMenu({
    container,
    attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1'],
  });
