import {Then} from "@cucumber/cucumber";
import assert = require("assert");
import {getInnerHTML, includesIgnoreCase} from "./helpers/dom.helpers";

Then('_{selector} content should contain {string}', async function (selector, expectedValue) {
    await this.page.waitForSelector(selector, {state: 'visible', timeout: 5000});

    const content = await getInnerHTML(this.page, selector);
    assert(includesIgnoreCase(content, expectedValue), `content of ${selector} should contain "${expectedValue}" but is "${content.trim()}"`);
});

Then('_{selector} content should not contain {string}', async function (selector, expectedValue) {
    await this.page.waitForSelector(selector, {state: 'visible', timeout: 5000});

    const content = await getInnerHTML(this.page, selector);
    assert(!includesIgnoreCase(content, expectedValue), `content of ${selector} should not contain "${expectedValue}"`);
});

Then('_store content value from selector {selector} as {string}', async function (selector, propertyName) {
    this.store[propertyName] = await getInnerHTML(this.page, selector);
});

Then('_{selector} attribute {string} is {interpolateValue}', async function (selector, attribute, expectedValue) {
    let content = await this.page.evaluate(({aselector, aattribute}) => {
        return document.querySelector(aselector).getAttribute(aattribute);
    }, {aselector: selector, aattribute: attribute});

    if (attribute === 'disabled') {
        content = (content === '' || content === 'true') ? 'true' : 'false';
    }

    const actual = String(content).trim().toLowerCase();
    const expected = expectedValue.toString().trim().toLowerCase();
    assert(actual === expected, `attribute ${attribute} of ${selector} is "${actual}" and should be "${expected}"`);
});
