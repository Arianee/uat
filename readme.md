# @arianee/uat

End-to-end / User Acceptance Testing written in **Gherkin**, run on real browsers.

`@arianee/uat` bundles [Cucumber.js](https://github.com/cucumber/cucumber-js) and [Playwright](https://playwright.dev) together with a library of ready-to-use steps: you write `.feature` files, nothing else.

- 🌍 **Chromium**, **Firefox** and **WebKit**
- 🧩 ~50 built-in steps: navigation, clicks, forms, content, styles, API calls, screenshots…
- 🗂 Built-in static server to test your Single Page Application
- 🎭 HTTP(S) mocks from JSON files
- 🎲 Random data with [faker](https://github.com/marak/Faker.js/) and variables (`{{MY_VAR}}`)

## Table of contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Selectors](#selectors)
- [Steps reference](#steps-reference)
- [Variables](#variables)
- [HTTP mocks](#http-mocks)
- [Configuration](#configuration)
- [Custom steps](#custom-steps)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## Requirements

- Node.js **>= 18**
- Playwright browsers: `npx playwright install` (add `--with-deps` on a fresh CI machine)

## Getting started

```bash
npm i -D @arianee/uat
npx playwright install chromium
```

Write your first test in `features/my-first.feature`:

```gherkin
Feature: My first User Acceptance Test

  Scenario: A user navigating to wikipedia lands on wikipedia
    Given _user navigates to 'https://en.wikipedia.org/wiki/Flag_of_the_United_Kingdom'
    Then _user page should land on 'https://en.wikipedia.org/wiki/Flag_of_the_United_Kingdom'
```

Run it:

```bash
npx uat features/my-first.feature
```

Any extra argument is forwarded to `cucumber-js`, e.g. to run a subset of scenarios by tag:

```bash
npx uat "features/**/*.feature" --tags @smoke
```

The process exits with code `1` if at least one scenario failed.

## Selectors

Every `'selector'` argument accepts:

| You write | It targets |
|---|---|
| `'.myClass'`, `'#myId'`, `'[name=email]'`, `'a > b'`, `'li:first-child'` | the CSS selector as is |
| `'<body'` | the HTML tag `body` |
| `'submit-button'` | `[data-e2e=submit-button]` |
| `'form email'` | `[data-e2e=form] [data-e2e=email]` (space = descendant) |

Classes and ids should be kept for styling. We recommend dedicated, meaningful `data-e2e` attributes:

```html
<button data-e2e="button_submit-account-creation" class="btn">Create my account</button>
```

```gherkin
When _user clicks on 'button_submit-account-creation'
```

Selectors can contain [variables](#variables): `'row-{{ID}}'`.

## Steps reference

In the tables below, `'…'` arguments are interpolated (variables and `FromEnv=` are resolved), `"…"` arguments are plain strings.

### Navigation

| Step | Description |
|---|---|
| `_user navigates to 'url'` | Opens the url and waits for the `load` event |
| `_user page should land on 'url'` | Asserts the current (decoded) url |
| `_'selector' is displayed` | Waits for the element to be visible |
| `_user has a w:'400' x h:'700'` | Resizes the viewport |
| `_user ordered favorite languages are 'en,fr-BE'` | Overrides `navigator.language(s)` for next navigations |

### Display

| Step | Description |
|---|---|
| `_user sees 'selector'` | Waits for exactly one visible element |
| `_user sees 3 'selector'` | Asserts the number of matching elements |
| `_user does not see 'selector'` | Waits for the element to be hidden (2 s) |
| `_user does not see 'selector' after few seconds` | Same as above |
| `_user does not see 'selector' after 5 seconds` | Waits up to N seconds for the element to disappear (e.g. a loader) |

### Interactions & forms

| Step | Description |
|---|---|
| `_user clicks on 'selector'` | Clicks a visible element |
| `_user set input 'selector' with 'value'` | Clicks the input and types with the real keyboard |
| `_user enter 'value'` | Types on the keyboard (focused element) |
| `_user presses down on keyboard key 'Enter'` | Presses a key ([key names](https://playwright.dev/docs/api/class-keyboard)) |
| `_user set input 'selector' with file from path 'path/to/file'` | Fills a file input |
| `_user fill up form` + table | Sets input values with JS (fast, no keyboard events) |
| `_wait for 2 seconds` / `_wait for 200 milliseconds` | Pauses the scenario |

```gherkin
Given _user fill up form
  | form inputText   | it is a string |
  | form selectInput | cat            |
  | form inputNumber | 22             |
```

### Content, attributes & style

| Step | Description |
|---|---|
| `_'selector' content should contain "text"` | Case-insensitive check on `innerHTML` |
| `_'selector' content should not contain "text"` | |
| `_'selector' content is "text"` | Exact (trimmed) `innerHTML` |
| `_'selector' inner text value should contain 'text'` | Case-insensitive check on `innerText` |
| `_'selector' input value should contain 'text'` | Case-insensitive check on an input value |
| `_'selector' input value should NOT contain 'text'` | |
| `_'selector' attribute "type" is 'text'` | Attribute value (`disabled` is normalized to `true`/`false`) |
| `_user sees color of 'selector' as '#ff0000'` | Computed color (any CSS color format) |
| `_user sees background-color of 'selector' as 'red'` | Computed background color |
| `_user sees font-family of 'selector' as 'Arial'` | Computed font family |

### API calls

```gherkin
Scenario: Dev can call POST api
  Given _api user can 'create user' with api call:
    | url       | https://my.api/users |
    | method    | POST                 |
    | x-api-key | {{API_KEY}}          |
  Given _api body of 'create user' is:
    """
    { "name": "{{RANDOM_NAME}}" }
    """
  When _api user make call 'create user'
  Then _api result status of 'create user' should be:
    | status | 201 |
  Then _api result body of 'create user' should be:
    | name | {{RANDOM_NAME}} |
  And _store value from api call 'create user' body property 'id' as '{{USER_ID}}'
```

Every row other than `url` and `method` is sent as a header (`Content-Type: application/json` by default).

### Screenshots

| Step | Description |
|---|---|
| `_take screenshot with file name 'dir/shot.png'` | Saves a screenshot |
| `_send screenshot 'dir/shot.png' to api 'url'` | POSTs the file as `multipart/form-data` |
| `_send screenshot 'dir/shot.png' to api 'url' with custom header` + JSON docstring | Same, with custom headers |

### Debug

| Step | Description |
|---|---|
| `_debug` | Pauses until you press a key in the terminal |

## Variables

### Storing values

```gherkin
Given _store value 'a string' as '{{MY_STRING}}'
Given _store value 'randomNumber' as '{{RANDOM_NUMBER}}'      # 1 → 9999
Given _store value 'randomString' as '{{RANDOM_STRING}}'      # 10 random chars
Given _store value 'internet.email' as '{{RANDOM_EMAIL}}'     # any faker.js 5 method
Given _store value from process.env.MY_ENV_VAR as '{{MY_VAR}}'
Given _store content value from selector 'title' as '{{TITLE}}'
Given _store value from api call 'create user' body property 'id' as '{{USER_ID}}'
```

Any [faker.js 5](https://github.com/marak/Faker.js/#api-methods) path works: `name.firstName`, `internet.password`, `datatype.uuid`, …

### Using values

Variables can be used in any `'…'` argument, in tables and in API bodies, alone or inside a string:

```gherkin
Given _user navigates to '{{BASE_URL}}/account/create'
Given _user set input '#email' with 'qa+{{RANDOM_NUMBER}}@example.com'
```

An argument of the form `'FromEnv=MY_VAR'` is replaced by `process.env.MY_VAR`.

### Local storage

```gherkin
Given _store value 'storedValue' in local storage as 'storageKey'
```

## HTTP mocks

Set `configuration.httpMocksPath` (we recommend `./features/mocks/http/`). Every request made by the page (navigation, `fetch`, XHR…) is matched against the mocks.

### Default mock (by route)

A JSON file **with** a `route` property is applied automatically. Name it as you like; we suggest a `-default` suffix (`users-default.json`):

```json
{
  "route": "https://my.api/users",
  "response": {
    "status": 200,
    "headers": { "access-control-allow-origin": "*" },
    "contentType": "application/json",
    "body": "[{\"name\":\"John\"}]"
  }
}
```

`response` accepts the options of Playwright's [`route.fulfill`](https://playwright.dev/docs/api/class-route#route-fulfill).

Routes support wildcards:

- `**` (at the start) matches any protocol + domain: `http(s)://(www.)any-domain.tld/`
- `*` matches any character except `/`

With `**/*/test`: `https://hello.world/123/test` ✅ `http://www.test.fr/hello/test` ✅ `https://test.fr/test` ❌

### Custom mock (per scenario)

A JSON file **without** `route` is a named mock you enable from a step (file name without `.json`):

```gherkin
Given _http mock for 'https://my.api/users' is 'users-empty'
Given _http mock for 'https://my.api/users' is reset to default value
```

A custom mock has priority over the default mock of the same route.

> 💡 Allow CORS in your mocks (`"access-control-allow-origin": "*"`), otherwise your app may reject the responses.

## Configuration

Create an optional `uat.config.json` at the root of your project (or point to another file with the `uatConfig` env variable):

```jsonc
{
  "serve": {
    "dir": "www",        // directory of your built SPA, served before the tests
    "port": 4200         // port of the static server
  },
  "env": {
    "myEnvValue": "myEnvValue" // copied into process.env
  },
  "configuration": {
    "headless": true,             // run browsers without UI
    "debug": false,               // pause before each step
    "slowMotion": 150,            // delay (ms) between each browser action
    "browser": "chromium",        // chromium | firefox | webkit
    "screenshotOnError": true,    // screenshot + browser console logs on failure
    "pathLogs": "./uat-debug",    // where failure artifacts are written
    "httpMocksPath": "./features/mocks/http/",
    "slack": {                    // optional: post failures (with screenshot) to Slack
      "channel": "C0123456789",
      "token": "xoxb-…"
    }
  }
}
```

| Key | Default |
|---|---|
| `headless` | `true` |
| `debug` | `false` |
| `slowMotion` | `150` |
| `browser` | `chromium` |
| `screenshotOnError` | `false` |
| `pathLogs` | `./uat-debug` |

Every `configuration` key can be overridden by an environment variable of the same name:

```bash
headless=false browser=firefox npx uat "features/**/*.feature"
```

On failure (with `screenshotOnError`), `failed_step.png` and `full_brower_log.json` (browser console) are written to `pathLogs`.

The Slack bot needs the `chat:write`, `channels:join` and `files:write` scopes.

## Custom steps

Compiled step files placed in `./custom_steps/*.step.js` are loaded automatically next to the built-in ones. They share the same Cucumber *World* (`this.page` is the Playwright page, `this.store` the variables):

```js
const { Then } = require('@cucumber/cucumber');

Then('_user is logged in', async function () {
  await this.page.waitForSelector('[data-e2e=avatar]');
});
```

## Debugging

- `headless=false npx uat …` to watch the browser.
- `_debug` step to pause a scenario where you want.
- `debug=true npx uat …` to pause before **every** step.

## Troubleshooting

### `TypeError [ERR_INVALID_ARG_TYPE]: The "from" argument must be of type string`

It happens when two copies of `@cucumber/cucumber` are loaded, typically when `@arianee/uat` is symlinked (`npm link`) into another project. Make sure the project resolves the same `@cucumber` folder as your local `@arianee/uat` (symlink or copy `node_modules/@cucumber` from one to the other). See [cucumber-js#1326](https://github.com/cucumber/cucumber-js/issues/1326).

### `browserType.launch: Executable doesn't exist`

Install the browsers matching your Playwright version: `npx playwright install`.
