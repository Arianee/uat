Feature: Dev can test a lot of thing

  Background:
    Given user navigates to 'http://localhost:4200'

  Scenario: Dev can use different selector
    Then user sees '.classSelector'
    Then user sees '#idSelector'
    Then user sees 'dataAttributeSelector'
    Then user sees 'dataAttributeSelector'
    Then user sees '#dynamicContent'
    Then user sees '<body'

  Scenario: Dev can interact different selector
    When user clicks on '#button1'
    Then user sees '.hadInteraction'

  Scenario: Dev can check content
    Then 'content' content should contain "simple content"
    Then 'content' content should not contain "complex content"
    Then 'content' content should not contain "content@johndoe.com"

  Scenario: Dev can interact with form
    Given user set input '#inputId' with 'value'
    Given '#inputId' input value should contain 'value'
    Given '#inputId' input value should NOT contain 'notTheVal'

  Scenario: Dev can check after a period of time
    Then user does not see '.removed-loader' after 5 seconds

  Scenario: Dev store from env variable
    Given store value from process.env.myEnvValue as '{{RANDOMNUMBER}}'
    Given user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given '#inputId' input value should contain 'myenvValue'

  Scenario: Dev can build its own variable with random number
    Given store value 'randomNumber' as '{{RANDOMNUMBER}}'
    Given user set input '#inputId' with '{{RANDOMNUMBER}}'
    Given user set input '#inputId' with 'mycustom-{{RANDOMNUMBER}}'
    Given '#inputId' input value should contain '{{RANDOMNUMBER}}'

  Scenario: Dev can build its own variable with random string
    Given store value 'randomString' as '{{RandomString}}'
    Given user set input '#inputId' with '{{RandomString}}'
    Given '#inputId' input value should contain '{{RandomString}}'


  Scenario: Dev can build its own variable with string
    Given store value 'a string' as '{{REGULARSTRING}}'
    Given user set input '#inputId' with '{{REGULARSTRING}}'
    Given user set input '#inputId' with 'mycustom-{{REGULARSTRING}}'

  Scenario: Dev can fill up a form quickly
    Given user fill up form
      | form inputText   | it is a string |
      | form selectInput | cat            |
      | form inputNumber | 22             |
    Given 'form inputText' input value should contain 'it is a string'
    Given 'form inputNumber' input value should contain '22'

  Scenario: Dev can fill up a form quickly
    Given store value 'a string' as '{{REGULARSTRING}}'
    Given user fill up form
      | form inputText   | {{REGULARSTRING}}       |
      | form selectInput | cat            |
      | form inputNumber | 22             |
    Given 'form inputText' input value should contain 'a string'
    Given 'form inputNumber' input value should contain '22'

  Scenario: Dev can retrieve and store content of div
    Given store content value from selector 'contentToStore' as '{{LINK}}'
    Given user set input 'form inputText' with '{{LINK}}'
    Given 'form inputText' input value should contain 'Content to retrieve'

  Scenario: Dev can retrieve and store content of div
    Given store content value from selector 'contentToStore' as '{{LINK}}'
    Given user fill up form
      | form inputText   | {{LINK}} |
    Given 'form inputText' input value should contain 'Content to retrieve'

    Scenario: User can get current URL
      Given user navigates to 'https://stackoverflow.com/questions/34701436/create-randomly-generated-url-for-content'
      Then user page should land on 'https://stackoverflow.com/questions/34701436/create-randomly-generated-url-for-content'

  Scenario: User can take a screenshot and name it
    Then take screenshot with file name 'gitIgnoreDirectory/screenshot1.jpg'

  Scenario: User can take a screenshot and name it
    Then take screenshot with file name 'gitIgnoreDirectory/screenshot1.png'
    Then send screenshot 'gitIgnoreDirectory/screenshot1.png' to api 'https://httpbin.org/post' with custom header
          """
         {
         "Breaking-Bad":"<3",
         "X-API-Key":"abcdef12345"
         }
        """
