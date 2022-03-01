import {Then} from "@cucumber/cucumber";
import assert = require("assert");

Then('_{selector} content should contain {string}', async function (selectorName, expectedValue) {
    await this.page.waitForSelector(selectorName, {
        visible: true,
        timeout: 5000
    });

    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, selectorName);

    assert(content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});

Then('_{selector} content should not contain {string}', async function (selectorName, expectedValue) {
    await this.page.waitForSelector(selectorName, {
        visible: true,
        timeout: 5000
    });

    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, selectorName);
    assert(!content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});


Then('_store content value from selector {selector} as {string}', async function (selector, propertyName) {

    const concatenatedSelector = this.utils.selectorFactory(selector);

    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    this.store[propertyName] = content;
});

Then('_{selector} {string} is {interpolateValue}', async function (selectorName, attribute, expectedValue) {
    let content = await this.page.evaluate((obj) => {
        const {aselector, aattribute} = obj;
        const element = document.querySelector(aselector);
        return element.getAttribute(aattribute);
    }, {aselector: selectorName, aattribute: attribute});

    if (attribute === 'disabled') {
        content = (content === '' || content === 'true') ? 'true' : 'false';
    }

    assert(content.toString().trim().toLowerCase() === expectedValue.toString().trim().toLowerCase());
});
