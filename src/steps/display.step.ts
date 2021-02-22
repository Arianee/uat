import {Given} from "@cucumber/cucumber";
import assert = require("assert");

Given('_user sees {selector}', async function (selectorName) {
    await this.page.waitForSelector(selectorName, {
        visible: true
    });
});

Given('_user does not see {selector} after few seconds', async function (selectorName) {
    const selector = this.utils.selectorFactory(selectorName)
    try {
        await this.page.waitForSelector(selector, {
            visible: true,
            timeout: 2000
        });
    } catch (e) {

    }

    await this.page.waitForSelector(selector, {
        hidden: true
    });
});

Given('_user does not see {selector} after {int} seconds', async function (selectorName,timeout) {
    try {
        await this.page.waitForSelector(this.utils.selectorFactory(selectorName), {
            visible: true,
            timeout: 3000
        });
    } catch (e) {
    }

    await this.page.waitForSelector(this.utils.selectorFactory(selectorName), {
        hidden: true,
        timeout: timeout*1000
    });
});

Given('_{selector} content is {string}', async function (selector, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selector);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    assert(content.trim()===expectedValue.trim());
});
