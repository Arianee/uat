import {Given, Then} from "cucumber";
import {getRandomInt, selectorFactory} from "./helpers/selectDataAttribute";
import {envReplace} from "./helpers/fromEnv";
import assert = require("assert");

Given('user enter {string}', async function (value) {

    await this.page.keyboard.type(value);
});

Given('store value {string} as {string}', async function (value,key) {
    if(value==='randomNumber'){
        this.store[key]=getRandomInt();
    }else{
        this.store[key]=value;
    }
});

Then('user set input {string} with {string}', async function (selector, value) {
    const concatenatedSelector = this.utils.selectorFactory(selector);
    const element = await this.page.waitForSelector(concatenatedSelector, {
        visible: true
    });

    await element.click();
    await this.page.keyboard.type(this.utils.interpolate(value).toString());
});

Then('wait for {int} seconds',async function(time){
    await this.page.waitFor(time*1000);
})


Then('{string} input value should contain {string}', async function (selectorName, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selectorName);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.value;
    }, concatenatedSelector);

    assert(content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});

Then('{string} input value should NOT contain {string}', async function (selectorName, expectedValue) {
    const concatenatedSelector = this.utils.selectorFactory(selectorName);
    const content = await this.page.evaluate((aselector) => {
        const element = document.querySelector(aselector);
        return element.value;
    }, concatenatedSelector);

    assert(!content.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
});
