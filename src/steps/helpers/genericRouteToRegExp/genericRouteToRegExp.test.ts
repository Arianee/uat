import { genericRouteToRegExp } from './genericRouteToRegExp';

describe('genericRouteToRegExp', () => {
  test('should convert a route with single wildcard (*) to a valid RegExp', () => {
    const route = '/api/*/details';
    const regExp = genericRouteToRegExp(route);
    expect(regExp).toBeInstanceOf(RegExp);
    expect('/api/user/details').toMatch(regExp);
    expect('/api/123/details').toMatch(regExp);
    expect('/api/@details').not.toMatch(regExp);
    expect('/api/@/details').toMatch(regExp);
    expect('/api/user/details/more').not.toMatch(regExp);
    expect('/other/user/details').not.toMatch(regExp);
  });

  test('should convert a route with double wildcard (**) to a valid RegExp', () => {
    const route = '/files/**';
    const regExp = genericRouteToRegExp(route);
    expect(regExp).toBeInstanceOf(RegExp);
    expect('/files/http://example.com/file.png').toMatch(regExp);
    expect('/files/https://www.example.com/file.png').toMatch(regExp);
    expect('/files/http://example.com/file').toMatch(regExp);
    expect('/files/valid').toMatch(regExp);
    expect('/other/http://example.com/file.png').not.toMatch(regExp);
  });

  test('should handle mixed wildcards (* and **) correctly', () => {
    const route = '/files/**/images/*';
    const regExp = genericRouteToRegExp(route);
    expect(regExp).toBeInstanceOf(RegExp);
    expect('/files/http://example.com/images/pic.jpg').toMatch(regExp);
    expect('/files/https://example.com/images/icon.png').toMatch(regExp);
    expect('/files/example.com/images/icon.png').toMatch(regExp);
    expect('/files/http://example.com/icons/icon.png').not.toMatch(regExp);
    expect('/other/http://example.com/images/icon.png').not.toMatch(regExp);
  });

  test('should handle routes without wildcards correctly', () => {
    const route = '/about';
    const regExp = genericRouteToRegExp(route);
    expect(regExp).toBeInstanceOf(RegExp);
    expect('/about').toMatch(regExp);
    expect('/about/').toMatch(regExp);
    expect('/about/more').not.toMatch(regExp);
    expect('/other').not.toMatch(regExp);
  });

  test('should escape special characters in the route', () => {
    const route = '/api/v1/resource?query=val&another=val';
    const regExp = genericRouteToRegExp(route);
    expect(regExp).toBeInstanceOf(RegExp);
    expect('/api/v1/resource?query=val&another=val').toMatch(regExp);
    expect('/api/v1/resource?query=val').not.toMatch(regExp);
  });

  describe('query params', () => {
    test('with **', () => {
      const route = "https://api.bdh-stef.arianee.com/certificate/v2/**"

      const regExp = genericRouteToRegExp(route);
      const route2 = "https://api.bdh-stef.arianee.com/certificate/v2/search?limit=1&q=%7B%22must%22%3A%5B%7B%22queryString%22%3A%7B%22defaultPath%22%3A%22tags%22%2C%22query%22%3A%22123456%22%7D%7D%5D%7D"
      expect(route2).toMatch(regExp);
    })

    test('exact matching', () => {
      const route = "https://api.bdh-stef.arianee.com/certificate/v2/search?limit=1&q=%7B%22must%22%3A%5B%7B%22queryString%22%3A%7B%22defaultPath%22%3A%22tags%22%2C%22query%22%3A%22123456%22%7D%7D%5D%7D"
      const regExp = genericRouteToRegExp(route);
      expect(route).toMatch(regExp);
    })
      test('exact matching', () => {
      const route = "https://api.bdh-stef.arianee.com/certificate/v2/search?limit=1&q=%7B%22must%22%3A%5B%7B%22queryString%22%3A%7B%22defaultPath%22%3A%22tags%22%2C%22query%22%3A%22123456%22%7D%7D%5D%7D"
      const regExp = genericRouteToRegExp(route);
      expect(route).toMatch(regExp);
    })
    test('not matching', () => {
      const route = "https://api.bdh-stef.arianee.com/certificate/v2/**"

      const regExp = genericRouteToRegExp(route);
      const route2 = "https://api.bdh-stef.arianee.com/certificate/v3/search?limit=1&q=%7B%22must%22%3A%5B%7B%22queryString%22%3A%7B%22defaultPath%22%3A%22tags%22%2C%22query%22%3A%22123456%22%7D%7D%5D%7D"
      expect(route2).not.toMatch(regExp);
    })

  })

});
