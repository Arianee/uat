The aim of this library is to easily test your web page with UAT.
Example from our test:
```Gherkin
Feature: Dev can test a lot of thing

  Background:
    Given _user navigates to 'http://localhost:4200'

  Scenario: Dev can use different selector
    Then _user sees '.classSelector'
    Then _user sees '#idSelector'
    Then _user sees 'dataAttributeSelector'
    Then _user sees '<body'

  Scenario: Dev can interact different selector
    When _user clicks on '#button1'
    Then _user sees '.hadInteraction'

  Scenario: Dev can check content
    Then _'content' content should contain "simple content"
    Then _'content' content should not contain "complex content"

  Scenario: Dev can interact with form
    Given _user set input '#inputId' with 'value'
    Given _'#inputId' input value should contain 'value'
    Given _'#inputId' input value should NOT contain 'notTheVal'

  Scenario: Dev can check after a period of time
    Then _user does not see '.removed-loader' after 5 seconds

  Scenario: Dev store from env variable
    Given _store value from process.env.myEnvValue as '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given _'#inputId' input value should contain 'myenvValue'

  Scenario: Dev can build its own variable with random number
    Given _store value 'randomNumber' as '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with 'mycustom-{{RANDOMNUMBER}}'

  Scenario: Dev can build its own variable with string
    Given _store value 'a string' as '{{REGULARSTRING}}'
    Given _user set input '#inputId' with '{{REGULARSTRING}}'
    Given _user set input '#inputId' with 'mycustom-{{REGULARSTRING}}'

  Scenario: Dev can fill up a form quickly
    Given _user fill up form
      | form inputText   | it is a string |
      | form selectInput | cat            |
      | form inputNumber | 22             |
    Given _'form inputText' input value should contain 'it is a string'
    Given _'form inputNumber' input value should contain '22'

  Scenario: Dev can fill up a form quickly
    Given _store value 'a string' as '{{REGULARSTRING}}'
    Given _user fill up form
      | form inputText   | {{REGULARSTRING}}       |
      | form selectInput | cat            |
      | form inputNumber | 22             |
    Given _'form inputText' input value should contain 'a string'
    Given _'form inputNumber' input value should contain '22'

  Scenario: Dev can retrieve and store content of div
    Given _store content value from selector 'contentToStore' as '{{LINK}}'
    Given _user set input 'form inputText' with '{{LINK}}'
    Given _'form inputText' input value should contain 'Content to retrieve'

  Scenario: Dev can retrieve and store content of div
    Given _store content value from selector 'contentToStore' as '{{LINK}}'
    Given _user fill up form
      | form inputText   | {{LINK}} |
    Given _'form inputText' input value should contain 'Content to retrieve'

    Scenario: User can get current URL
      Given _user navigates to 'https://stackoverflow.com/questions/34701436/create-randomly-generated-url-for-content'
      Then _user page should land on 'https://stackoverflow.com/questions/34701436/create-randomly-generated-url-for-content'

  Scenario: User can take a screenshot and name it
    Then _take screenshot with file name 'gitIgnoreDirectory/screenshot1.jpg'

  Scenario: User can take a screenshot and name it
    Then _take screenshot with file name 'gitIgnoreDirectory/screenshot1.png'
    Then _send screenshot 'gitIgnoreDirectory/screenshot1.png' to api 'https://httpbin.org/post' with custom header
          """
         {
         "Breaking-Bad":"<3",
         "X-API-Key":"abcdef12345"
         }
        """

 Scenario: Dev can pause
     Given _store value 'a string' as '{{REGULARSTRING}}'
     Given _debug #<== use this to pause

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
```


# How to get started:

```bash
npm install @arianee/uat -S
```

To execute simply:

```bash
"uat features/implemented/**/*.feature",

```

# Configuration variables
```process.env.DEBUG``` : setting up debug mode. It will wait for user input to continue to next step.
```process.env.headless``` : setting up headless mode of browser. default ```true```

Or you can create ```uat.config.json`` next to your package.json:
```json
{
  "serve": {
    "dir": "www",
    "port": 4200
  },
  "env": {
    "myEnvValue": "myEnvValue"
  },
  "configuration": {
    "headless": true,
    "debug": false,
    "slowMotion": 150
  }
}

````
# How to debug

There is 2 ways to debug.
You can set ```process.env.DEBUG``` to ```true``` and it will wait for your input to pass to next step.

```bash
"DEBUG=true uat features/**.feature"
```
It will output in terminal:
```
Feature: Dev can test a lot of thing

  @dev
  Scenario: Dev can build its own variable with string
Press any key to continue to next step
    Given user navigates to 'http://localhost:4200'
Press any key to continue to next step
    Given store value 'a string' as '##REGULARSTRING##'
Press any key to continue to next step

```

Or you can use the ```debug``` step

```Gherkin
 Scenario: Dev can pause
     Given store value 'a string' as '##REGULARSTRING##'
     Given debug #<== use this to pause
```

Also you can set ```process.env.headless``` to ```true```

```bash
"DEBUG=true headless=true uat features/**.feature"
```
