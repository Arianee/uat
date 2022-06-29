import {Given} from "@cucumber/cucumber";
import assert = require("assert");

Given('_user sees {selector}', async function (selectorName) {
    await this.page.waitForSelector(selectorName, {
        visible: true,
        strict: true
    });
});

Given('_user sees {int} {selector}', async function (elementCount,selectorName) {
    await this.page.waitForSelector(selectorName, {
        visible: true
    });

    const elements = await this.page.$$(selectorName);
    assert(elementCount===elements.length,`element count of ${selectorName} is ${elements.length} and should be ${elementCount}`);
});

Given('_user does not see {selector} after few seconds', async function (selectorName) {
    const selector = this.utils.selectorFactory(selectorName);
    try {
        await this.page.waitForSelector(selector, {
            state: 'visible',
            strict: true,
            timeout: 2000
        });
    } catch (e) {
    }

    await this.page.waitForSelector(selector, {
        state: 'hidden',
        timeout: 2000,
        strict: true
    });
});

Given('_user does not see {selector} after {int} seconds', async function (selectorName, timeout) {
    try {
        await this.page.waitForSelector(this.utils.selectorFactory(selectorName), {
            state: 'visible',
            timeout: 3000,
            strict: true
        });
    } catch (e) {
    }

    await this.page.waitForSelector(this.utils.selectorFactory(selectorName), {
        state: 'hidden',
        timeout: timeout * 1000,
        strict: true
    });
});

Given('_{selector} content is {string}', async function (selector, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selector);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    assert(content.trim() === expectedValue.trim());
});
