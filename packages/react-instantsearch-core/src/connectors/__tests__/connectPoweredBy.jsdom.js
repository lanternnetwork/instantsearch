/**
 * @jest-environment jsdom
 */

import connect from '../connectPoweredBy';

jest.mock('../../core/createConnector', () => (x) => x);

describe('connectPoweredBy', () => {
  const { getProvidedProps } = connect;

  it('provides the correct props to the component', () => {
    const props = getProvidedProps();

    expect(props).toEqual({
      url: 'https://www.algolia.com/?utm_source=react-instantsearch&utm_medium=website&utm_content=localhost&utm_campaign=poweredby',
    });
  });

  it('handles react native environment in window without location object', () => {
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    const { location, ...windowWithoutLocation } = originalWindow;
    windowSpy.mockImplementation(() => windowWithoutLocation);
    const props = getProvidedProps();
    expect(props).toEqual({
      url: 'https://www.algolia.com/?utm_source=react-instantsearch&utm_medium=website&utm_content=&utm_campaign=poweredby',
    });
    windowSpy.mockRestore();
  });
});
