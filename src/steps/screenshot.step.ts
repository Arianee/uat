import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";
import FormData from 'form-data'
import fetch,{Headers} from 'node-fetch';
import {readFileSync} from "fs";

Then('take screenshot with file name {interpolateValue}', async function (screenshotFileName) {
    await this.page.screenshot({path: screenshotFileName});
});

Then('send screenshot {interpolateValue} to api {interpolateValue}', async function (screenshotFileName, apiURL) {
    const buffer = readFileSync(screenshotFileName);
    const form = new FormData();

    form.append(screenshotFileName, buffer);

    fetch(apiURL, {method: 'POST', body: form})
        .then(res => res.json())
        .then(json => console.log(json));
});

Then('send screenshot {interpolateValue} to api {interpolateValue} with custom header', async function (screenshotFileName, apiURL, customHeaders) {
    const buffer = readFileSync(screenshotFileName);
    const form = new FormData();

    form.append(screenshotFileName, buffer);

    await fetch(apiURL, {method: 'POST', body: form, headers:new Headers(JSON.parse(customHeaders))})
        .then(res => res.json())
        .then(json => console.log(json));
});
