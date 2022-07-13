import { Given, Before } from '@cucumber/cucumber';

function genericRouteToRegExp(route) {
  let regExpStr = route
    .replace('**', '{DOUBLE_WILDCARD}')
    .replace(/\*/g, '[a-zA-Z0-9@:%._\\-\\+~#=]*')
    .replace(
      '{DOUBLE_WILDCARD}',
      '[(http(s)?):\\/\\/(www.)?a-zA-Z0-9@:%._\\-\\+~#=]{2,256}\\.{0,1}[a-z]{0,6}\\/*'
    );

  return new RegExp('^' + regExpStr + '\\/*$');
}

function getMockedRouteResponse(url) {
  for (let genericRoute in this.overridenHttpMocks) {
    if (genericRouteToRegExp(genericRoute).test(url)) {
      return this.overridenHttpMocks[genericRoute];
    }
  }

  for (let genericRoute in this.defaultHttpMocks) {
    if (genericRouteToRegExp(genericRoute).test(url)) {
      return this.defaultHttpMocks[genericRoute];
    }
  }

  return null;
}

function readHttpMockFiles() {
  const fs = require('fs');

  if (!this.configuration.configuration.httpMocksPath) {
    console.warn(
      'httpMocksPath key not set in configuration file under configuration property, please set it if you intend to use http mocks'
    );
    return;
  }

  const dirname = this.configuration.configuration.httpMocksPath;

  const files = fs.readdirSync(dirname);
  files.forEach((filename) => {
    const content = fs.readFileSync(dirname + filename, 'utf8');

    try {
      const mockedJSON = JSON.parse(content);
      if (mockedJSON.route) {
        this.defaultHttpMocks[mockedJSON.route] = mockedJSON.response;
      } else {
        this.customHttpMocks[filename.replace('.json', '')] = mockedJSON.response;
      }
    } catch (e) {
      console.error(
        `Could not parse content of http mock file (${filename}), is it a valid json?`,
        e
      );
    }
  });
}

Before(async function () {
  this.defaultHttpMocks = {};
  this.customHttpMocks = {};

  // If the step `mock for {route} is {mock-name} called`, then it will override the default http mock with mock-name response
  this.overridenHttpMocks = {};

  readHttpMockFiles.apply(this, []);

  await this.page.route('**/*', (route) => {
    const interceptedUrl = route.request().url();
    const mockedRouteResponse = getMockedRouteResponse.apply(this, [interceptedUrl]);

    if (mockedRouteResponse) {
      route.fulfill(mockedRouteResponse);
    } else {
      route.continue();
    }
  });
});

Given('_http mock for {string} is {string}', function (url, httpMockFileName) {
  this.overridenHttpMocks[url] = this.customHttpMocks[httpMockFileName];
});

Given('_http mock for {string} is reset to default value', function (url) {
  delete this.overridenHttpMocks[url];
});
