Feature: Dev can test a lot of thing

  Scenario: Dev can call GET api
    Given _api user can 'http 200' with api call:
      | url              | https://httpbin.org/get |
      | x-api-key        | 123456                  |
      | method           | GET                     |

    When _api user make call 'http 200'

    Then _api result status of 'http 200' should be:
      | status           | 200                     |

  Scenario: Dev can call GET api
    Given _api user can 'http 404' with api call:
      | url              | https://httpbin.org/gt |
      | x-api-key        | 123456                  |
      | method           | GET                     |

    When _api user make call 'http 404'

    Then _api result status of 'http 404' should be:
      | status           | 404                     |

  Scenario: Dev can call POST api
    Given _api user can 'http 200' with api call:
      | url              | https://httpbin.org/post |
      | x-api-key        | 123456                   |
      | method           | POST                     |

    Given _api body of 'http 200' is:
      """
     {
     "Breaking-Bad":"<3",
     "X-API-Key":"abcdef12345"
     }
    """

    When _api user make call 'http 200'

    Then _api result status of 'http 200' should be:
      | status           | 200                     |
    Then _api result body of 'http 200' should be:
        | url           | https://httpbin.org/post |

    And _store value from api call 'http 200' body property 'url' as '{{URL}}'
