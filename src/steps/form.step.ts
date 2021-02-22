import {Given, Then} from "@cucumber/cucumber";
import {getRandomInt, selectorFactory} from "./helpers/selectDataAttribute";
import assert = require("assert");

Given('_user enter {interpolateValue}', async function (value) {
    await this.page.keyboard.type(value);
});

Then('_user set input {selector} with {interpolateValue}', async function (selector, value) {
    const element = await this.page.waitForSelector(selector, {
        visible: true
    });

    await element.click();
    await this.page.keyboard.type(value);
});

Then('_user set input {selector} with file from path {interpolateValue}', async function (selector, filePath) {
    const element = await this.page.waitForSelector(selector, {
        visible: true
    });

    element.uploadFile(filePath);

});

Then('_wait for {int} seconds',async function(time){
    await this.page.waitFor(time*1000);
})


Then('_{selector} input value should contain {interpolateValue}', async function (selectorName, expectedValue) {
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.value;
    }, selectorName);

    assert(content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});

Then('_{selector} input value should NOT contain {interpolateValue}', async function (selectorName, expectedValue) {
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.value;
    }, selectorName);

    assert(!content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});

Then('_user fill up form', async function (tableForm) {

    const properties = tableForm.raw();


    const prepareProperties = properties.map(([selectorName, value]) => {
        const concatenatedSelector = this.utils.selectorFactory(selectorName);
        const trueValue=this.utils.interpolate(value).toString();

        return [concatenatedSelector, trueValue]
    });

    const content = await this.page.evaluate((selectors) => {
        selectors.forEach(([selector, value]) => {
            const element = document.querySelector(selector);
            element.value=value
        })
    }, prepareProperties);

});
