import {Given} from "cucumber";
import assert = require("assert");

Given('user sees {string}', async function (selectorName) {
    await this.page.waitForSelector(this.utils.selectorFactory(selectorName), {
        visible: true
    });
});

Given('user does not see {string} after {int} seconds', async function (selectorName,timeout) {
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

Given('{string} content is {string}', async function (selector, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selector);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    assert(content.trim()===expectedValue.trim());
});
