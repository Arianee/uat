@http
Feature: Dev can intercept http requests

  Scenario: Http call is intercepted using default mock for this route
    Given _user navigates to 'http://localhost:4200/example'
    Then _user sees '.mockedHttp'
  
  Scenario: Http call is intercepted using custom mock
    Given _http mock for 'http://localhost:4200/example' is 'example-custom'
    Given _user navigates to 'http://localhost:4200/example'
    Then _user sees '.mockedHttpCustom'

  Scenario: Http call is intercepted using custom mock and can be reset
    Given _http mock for 'http://localhost:4200/' is 'example-custom'
    Given _user navigates to 'http://localhost:4200/'
    Then _user sees '.mockedHttpCustom'
    Given _http mock for 'http://localhost:4200/' is reset to default value
    Given _user navigates to 'http://localhost:4200/'
    Then _user sees '.classSelector'

  Scenario: Dev can use double and single wildcards in the url
    Given _http mock for '**/*/*/something' is 'example-custom'
    Given _user navigates to 'http://google.com/path/to/something'
    Then _user sees '.mockedHttpCustom'

  Scenario: Dev can use single wildcards in the url 
    Given _http mock for 'http://arianee.org/it/*/works' is 'example-custom'
    Given _user navigates to 'http://arianee.org/it/123456/works'
    Then _user sees '.mockedHttpCustom'

  Scenario: Http call that is not mocked still work as expected
    Given _user navigates to 'http://localhost:4200/'
    Then _user sees '.classSelector'

  Scenario: Http call made by javascript fetch is intercepted
    Given _http mock for 'http://localhost:4200/fetch' is 'example-fetch'
    Given _http mock for 'http://localhost:4200/fetch2' is 'example-fetch2'
    Given _user navigates to 'http://localhost:4200/fetch'
    Then _user sees '.fetched'

  Scenario: Http call made by javascript fetch is intercepted with json response
    Given _http mock for 'http://localhost:4200/fetch-json' is 'example-fetch-json'
    Given _user navigates to 'http://localhost:4200/fetch-json'
    Then _'<body' content should contain "John"