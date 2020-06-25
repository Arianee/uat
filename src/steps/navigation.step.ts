import { Given, setDefaultTimeout, Then } from 'cucumber';
import {selectorFactory} from "./helpers/selectDataAttribute";
import {envReplace} from "./helpers/fromEnv";
import assert = require("assert");
setDefaultTimeout(60 * 1000);

Given('user navigates to {interpolateValue}',async function(url){
    await this.page.goto(envReplace(url));
})

Then('{selector} is displayed', async function (selector) {
    await this.page.waitForSelector(selectorFactory(selector), {
        visible: true
    });
});

Then('user page should land on {interpolateValue}', async function (shouldBeURL) {
    const url= this.page.url();
    assert(url ===shouldBeURL)
});
