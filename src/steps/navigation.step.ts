import { Given, setDefaultTimeout, Then } from 'cucumber';
import {selectorFactory} from "./helpers/selectDataAttribute";
import {envReplace} from "./helpers/fromEnv";
setDefaultTimeout(60 * 1000);

Given('user navigates to {string}',async function(url){
    await this.page.goto(envReplace(url));
})

Then('{string} is displayed', async function (selector) {
    await this.page.waitForSelector(selectorFactory(selector), {
        visible: true
    });
});

