import {Then} from "@cucumber/cucumber";

Then('_user clicks on {selector}', async function (selector) {
    try {
        const element = await this.page.waitForSelector(selector, {
            visible: true
        });

        await element.click();
    } catch (err) {
        throw err
}
});


Then('_user presses down on keyboard key {interpolateValue}', async function (value) {
    await this.page.keyboard.down(value);
});
