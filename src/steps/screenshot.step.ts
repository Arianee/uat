import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";


Then('take screenshot with file name {interpolateValue}', async function (screenshotFileName) {

    await this.page.screenshot({path: `${screenshotFileName}.png`});
    console.log(screenshotFileName)
});

