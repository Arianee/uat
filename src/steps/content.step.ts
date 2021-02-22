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

