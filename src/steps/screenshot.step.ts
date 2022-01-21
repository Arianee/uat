import {Then} from "@cucumber/cucumber";
import FormData from 'form-data'
import fetch, {Headers} from 'node-fetch';
import {readFileSync} from "fs";

Then('_user has a w:{interpolateValue} x h:{interpolateValue}',async function(width,height){
    await this.page.setViewportSize({
        width: parseInt(width),
        height: parseInt(height),
        deviceScaleFactor: 1
    });
})

Then('_take screenshot with file name {interpolateValue}', async function (screenshotFileName) {
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
