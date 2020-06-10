import {Then} from "cucumber";
import assert = require("assert");

Then('{string} content should contain {string}', async function (selectorName, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selectorName);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    console.log('content', content);
    assert(content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));

});

Then('{string} content should not contain {string}', async function (selectorName, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selectorName);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.innerHTML;
    }, concatenatedSelector);

    assert(!content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});
