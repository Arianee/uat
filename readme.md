## What is it?
It is a very easy lib for e2e testing with gherkin on multiple browser.


## What browsers?

Under the hood, **@arianee/uat** uses [playwirght](https://github.com/microsoft/playwright), the Microsoft lib. So you can 
test on:
1. **Chromium**
2. **Webkit**
3. **Firefox**


## Getting started

```bash
npm i @arianee/uat -S
```

You don't need anything else. @arianee/uat comes with Gherkin (cucumberjs) and Playwright.

Then write you first test. Create myfile.features

```gherkin
Feature: I am making my first User Acceptance Test

    Scenario: A user navigating to wikipedia should be on wikipedia
      Given _user navigates to 'https://en.wikipedia.org/wiki/Flag_of_the_United_Kingdom'
      Then _user page should land on 'https://en.wikipedia.org/wiki/Flag_of_the_United_Kingdom'
```

(This is very useless test)

And execute simply:

```bash
"uat myfile.feature",
```

## What can I do?

#### Selectors:

You can use all the classic css selector ```#id```, ```.class```. But these should be kept for styling but not for testing.
 We suggest you to add a special data attribute ```data-e2e='my-fisrt-test'```. Then you write
 
 ```html
        <button data-e2e="my-fisrt-test" class="keep-for-stylinh"> My Submit button</button>
```
 ``` Then _user clicks on 'my-fisrt-test' ``` and it ```@arianee/uat``` will find its way.
 
 We suggest to use very meaningul name in order to make it easily readble
 
  ``` Then _user clicks on 'button_submit-account-creation' ```.

### Checking Display

```gherkin
    Then _user sees '.classSelector'
    Then _user sees '#idSelector'
    Then _user sees 'dataAttributeSelector'
    Then _user sees '<body'
```

### Clicks on selector
```gherkin
  When _user clicks on '#button1'
```

### Check content (text)

```gherkin
  Then _'content' content should contain "simple content"
   Then _'content' content should not contain "complex content"
```

### Fill form

```gherkin
// real keyboard input
Given _user set input '#inputId' with 'value'

// fill form with js
Given _user fill up form
      | form inputText   | it is a string |
      | form selectInput | cat            |
      | form inputNumber | 22             |
```

### Use custom variable

@arianee/uat allows you to use your own variable. We use [fakejs](https://github.com/marak/Faker.js/).
```gherkin
      Given _store value 'internet.email' as '{{randomEmail}}'
      Given _store value 'internet.password' as '{{randomPassword}}'
      Given _store value 'random.number' as '{{randomNumber}}'
      Given _store value 'random.word' as '{{randomWord}}'
```
You can also retrieve variable from ```process.env``` and use it in a form

```gherkin
    Given _store value from process.env.myEnvValue as '{{YourVariable}}'
    Given _user set input '#inputId' with '{{YourVariable}}'
```

It can be useful to test url without specifying host:
```gherkin
    Given _store value from process.env.MYURL as '{{MyURL}}'
    Given _user navigates to '{{MyURL}}/account/create'
```

You can store a value in the local storage
```gherkin
    Given _store value 'storedValue' in local storage as 'storageKey'
```


### Take Screenshot and send it
```gherkin

Scenario: User can take a screenshot and name it
    Then _take screenshot with file name 'myDir/screenshot1.png'
    Then _send screenshot 'myDir/screenshot1.png' to api 'https://httpbin.org/post' with custom header
          """
         {
         "Breaking-Bad":"<3",
         "X-API-Key":"abcdef12345"
         }
        """
```

### Debug 

It sometimes hard to debug Gherkin. To pause your test you can:

```gherkin
      Then _debug
```

It will pause until you press any key.

### Single Page Application

@arianee/uat is created to easily test SPA. It embeds its own http server. In ```uat.config.json```, specify directory of your built spa, and it will serve it.


```json
{
"serve": {
    "dir": "www",
    "port": 4200
  }
}
```

### Configuration variables
```
{
  "serve": {
    "dir": "www", // directory of your built SPA
    "port": 4200 // port to serve your spa.
  },
  "env": {
    "myEnvValue": "myEnvValue" // will be available in process.env
  },
  "configuration": {
    "headless": true, // headless mode
    "debug": false, // step by step debug
    "slowMotion": 150, // speed user does each action
    "browser": "chromium", // browser to test
    "screenshotOnError": true // take a screenshot on error
  }
}
```

```process.env.DEBUG``` : setting up debug mode. It will wait for user input to continue to next step.
```process.env.headless``` : setting up headless mode of browser. default ```true```
Each configuration in uat.config.json can be overriden with process.env

```bash
headless=false uat features/*.features
```

### Our test
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

  Scenario: User wait for n seconds/miliseconds
    Given _wait for 1 seconds
    Given _wait for 1 milliseconds


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
