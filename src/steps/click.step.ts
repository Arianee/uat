import {Then} from "cucumber";

Then('user clicks on {selector}', async function (selector) {
    try {
        const element = await this.page.waitForSelector(selector, {
            visible: true
        });

        await element.click();
    } catch (err) {
        await this.page.screenshot({path: 'buddy-screenshot.png'});

        throw err
}
});


