import {Given, setDefaultTimeout, Then} from '@cucumber/cucumber';
import {envReplace} from "./helpers/fromEnv";
import assert = require("assert");

setDefaultTimeout(60 * 1000);

Given('_user navigates to {interpolateValue}', async function (url) {
    await this.page.goto(envReplace(url), {waitUntil: 'load'});
});

Then('_{selector} is displayed', async function (selector) {
    await this.page.waitForSelector(selector, {state: 'visible'});
});

Then('_user page should land on {interpolateValue}', async function (shouldBeURL) {
    const url = decodeURIComponent(this.page.url());
    assert(url === shouldBeURL, `current url is ${url} and should be ${shouldBeURL}`);
});
