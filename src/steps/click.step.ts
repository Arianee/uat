import {Then} from "@cucumber/cucumber";

Then('_user clicks on {selector}', async function (selector) {
    const element = await this.page.waitForSelector(selector, {state: 'visible'});
    await element.click();
});

Then('_user presses down on keyboard key {interpolateValue}', async function (value) {
    await this.page.keyboard.down(value);
});
