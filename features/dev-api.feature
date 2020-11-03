Feature: Dev can test a lot of thing

  Scenario: Dev can call GET api
    Then _api user can 'http 200' with api call:
      | url              | https://httpbin.org/get |
      | x-api-key        | 123456                  |
      | method           | GET                     |
    Then _api result status of 'http 200' should be:
      | status           | 200                     |

  Scenario: Dev can call GET api
    Then _api user can 'http 404' with api call:
      | url              | https://httpbin.org/gt |
      | x-api-key        | 123456                  |
      | method           | GET                     |
    Then _api result status of 'http 404' should be:
      | status           | 404                     |

  Scenario: Dev can call POST api
    Then _api user can 'http 200' with api call:
      | url              | https://httpbin.org/post |
      | x-api-key        | 123456                   |
      | method           | POST                     |
    Then _api result status of 'http 200' should be:
      | status           | 200                     |
    Then _api result body of 'http 200' should be:
        | url           | https://httpbin.org/post |
