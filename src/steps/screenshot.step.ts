import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";
import FormData from 'form-data'
import fetch,{Headers} from 'node-fetch';
import {readFileSync} from "fs";


Then('_take screenshot with file name {interpolateValue}', async function (screenshotFileName) {


    const heightOfVisiblePage = await this.page.evaluate(() => {
        var body = document.body,
            html = document.documentElement;

        return Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    });

    await this.page.setViewport({
        width: 340,
        height: heightOfVisiblePage,
        deviceScaleFactor: 1
    });

    await this.page.screenshot({path: screenshotFileName});
});
Then('_send screenshot {interpolateValue} to api {interpolateValue}', async function (screenshotFileName, apiURL) {
    const buffer = readFileSync(screenshotFileName);
    const form = new FormData();


    form.append(screenshotFileName, buffer);

    fetch(apiURL, {method: 'POST', body: form})
        .then(res => res.json())
});

Then('_send screenshot {interpolateValue} to api {interpolateValue} with custom header', async function (screenshotFileName, apiURL, customHeaders) {
    const buffer = readFileSync(screenshotFileName);
    const form = new FormData();

    form.append(screenshotFileName, buffer);

    await fetch(apiURL, {method: 'POST', body: form, headers:new Headers(JSON.parse(customHeaders))})
        .then(res => res.json())
});
