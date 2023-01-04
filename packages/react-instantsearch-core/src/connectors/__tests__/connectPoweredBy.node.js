/**
 * @jest-environment node
 */

import connect from '../connectPoweredBy';

jest.mock('../../core/createConnector', () => (x) => x);

describe('connectPoweredBy', () => {
  const { getProvidedProps } = connect;

  it('provides the correct props to the component', () => {
    const props = getProvidedProps();

    expect(props).toEqual({
      url: 'https://www.algolia.com/?utm_source=react-instantsearch&utm_medium=website&utm_content=&utm_campaign=poweredby',
    });
  });
});
