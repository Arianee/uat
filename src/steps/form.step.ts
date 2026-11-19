import {Given, Then} from "@cucumber/cucumber";
import assert = require("assert");
import {waitFor} from "./helpers/waitFor";
import {getInputValue, includesIgnoreCase} from "./helpers/dom.helpers";

Given('_user enter {interpolateValue}', async function (value) {
    await this.page.keyboard.type(value);
});

Then('_user set input {selector} with {interpolateValue}', async function (selector, value) {
    const element = await this.page.waitForSelector(selector, {state: 'visible'});

    await element.click();
    await this.page.keyboard.type(value);
});

Then('_user set input {selector} with file from path {interpolateValue}', async function (selector, filePath) {
    await this.page.waitForSelector(selector, {state: 'visible'});
    await this.page.setInputFiles(selector, filePath);
});

Then('_wait for {int} seconds', async function (time) {
    await waitFor(time * 1000);
});

Then('_wait for {int} milliseconds', async function (time) {
    await waitFor(time);
});

Then('_{selector} inner text value should contain {interpolateValue}', async function (selector, expectedValue) {
    const content = await this.page.innerText(selector);
    assert(includesIgnoreCase(content, expectedValue), `inner text of ${selector} should contain "${expectedValue}" but is "${content.trim()}"`);
});

Then('_{selector} input value should contain {interpolateValue}', async function (selector, expectedValue) {
    const content = await getInputValue(this.page, selector);

    assert(content, `content from ${selector} is empty`);
    assert(includesIgnoreCase(content, expectedValue), `value of ${selector} should contain "${expectedValue}" but is "${content.trim()}"`);
});

Then('_{selector} input value should NOT contain {interpolateValue}', async function (selector, expectedValue) {
    const content = await getInputValue(this.page, selector);

    assert(!includesIgnoreCase(content, expectedValue), `value of ${selector} should not contain "${expectedValue}"`);
});

Then('_user fill up form', async function (tableForm) {
    const selectorsAndValues: [string, string][] = tableForm.raw().map(([selectorName, value]) => [
        this.utils.selectorFactory(selectorName),
        this.utils.interpolate(value).toString()
    ]);

    await this.page.evaluate((entries) => {
        entries.forEach(([selector, value]) => {
            (document.querySelector(selector) as HTMLInputElement).value = value;
        });
    }, selectorsAndValues);
});
