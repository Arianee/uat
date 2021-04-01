@front
Feature: Dev can test a lot of thing

  Background:
    Given _user navigates to 'http://localhost:4200'

  Scenario: Dev can use different selector
    Then _user sees '.classSelector'
    Then _user sees '#idSelector'
    Then _user sees 'dataAttributeSelector'
    Then _user sees 'dataAttributeSelector'
    Then _user sees '#dynamicContent'
    Then _user sees '<body'

  Scenario: Dev can interact different selector
    When _user clicks on '#button1'
    Then _user sees '.hadInteraction'

  Scenario: Dev can check css style of selector
    Then _user sees color of 'yellow-bg_red-font' as 'red'
    Then _user sees background-color of 'yellow-bg_red-font' as 'yellow'
    Then _user sees color of 'yellow-bg_red-font' as 'red'
    Then _user sees background-color of 'red-bg_red-font' as 'red'
    Then _user sees font-family of 'red-bg_red-font' as 'Arial'

  Scenario: Dev can check content
    Then _'content' content should contain "simple content"
    Then _'content' content should not contain "complex content"
    Then _'content' content should not contain "content@johndoe.com"

  Scenario: Dev can interact with form
    Given _user set input '#inputId' with 'value'
    Given _'#inputId' input value should contain 'value'
    Given _'#inputId' input value should NOT contain 'notTheVal'

  Scenario: Dev can check after a period of time
    Then _user does not see '.removed-loader' after 5 seconds

  Scenario: Dev can check after few seconds loader disappear
    Then _user does not see '.removed-loader' after few seconds

  Scenario: Dev store from env variable
    Given _store value from process.env.myEnvValue as '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given _'#inputId' input value should contain 'myenvValue'

  Scenario: Dev can build its own variable with fakejs
    Given _store value 'internet.email' as '{{randomEmail}}'
      Given _store value 'internet.password' as '{{randomPassword}}'
      Given _store value 'random.number' as '{{randomNumber}}'
      Given _store value 'random.word' as '{{randomWord}}'

  Scenario: Dev can build its own variable with random number
    Given _store value 'randomNumber' as '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given _user set input '#inputId' with 'mycustom-{{RANDOMNUMBER}}'
    Given _'#inputId' input value should contain '{{RANDOMNUMBER}}'

  Scenario: Dev can build its own variable with random string
    Given _store value 'randomString' as '{{RandomString}}'
    Given _user set input '#inputId' with '{{RandomString}}'
    Given _'#inputId' input value should contain '{{RandomString}}'


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

  Scenario: Dev can upload file
    Then _user set input 'inputFile' with file from path 'package.json'
    Then _user sees '.file-Uploaded'

  Scenario: User can store a value in local storage
    Given _store value 'storedValue' in local storage as 'storageKey'
