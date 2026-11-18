import {Then} from "@cucumber/cucumber";
import FormData from 'form-data';
import fetch, {Headers} from 'node-fetch';
import {readFileSync} from "fs";

const sendScreenshot = async (screenshotFileName: string, apiURL: string, headers?: Record<string, string>) => {
    const form = new FormData();
    form.append(screenshotFileName, readFileSync(screenshotFileName));

    const response = await fetch(apiURL, {method: 'POST', body: form, headers: new Headers(headers)});
    return response.json();
};

Then('_user has a w:{interpolateValue} x h:{interpolateValue}', async function (width, height) {
    await this.page.setViewportSize({
        width: parseInt(width, 10),
        height: parseInt(height, 10)
    });
});

Then('_take screenshot with file name {interpolateValue}', async function (screenshotFileName) {
    await this.page.screenshot({path: screenshotFileName});
});

Then('_send screenshot {interpolateValue} to api {interpolateValue}', async function (screenshotFileName, apiURL) {
    await sendScreenshot(screenshotFileName, apiURL);
});

Then('_send screenshot {interpolateValue} to api {interpolateValue} with custom header', async function (screenshotFileName, apiURL, customHeaders) {
    await sendScreenshot(screenshotFileName, apiURL, JSON.parse(customHeaders));
});
