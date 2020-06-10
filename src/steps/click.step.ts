import {Then} from "cucumber";
import {selectorFactory} from "./helpers/selectDataAttribute";

Then('user clicks on {string}', async function (selector) {
    try {
        const concatenatedSelector = this.utils.selectorFactory(selector);

        const element = await this.page.waitForSelector(concatenatedSelector, {
            visible: true
        });
        await element.click();
    } catch (err) {
        await this.page.screenshot({path: 'buddy-screenshot.png'});

        throw err
}
});
