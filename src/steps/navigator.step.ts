import {Given} from "@cucumber/cucumber";

Given('_user ordered favorite languages are {string}', async function (languagesValue) {
    const languages = languagesValue.split(',');

    await this.page.addInitScript((languagesOfUser) => {
        Object.defineProperty(navigator, 'language', {get: () => languagesOfUser[0]});
        Object.defineProperty(navigator, 'languages', {get: () => languagesOfUser});
    }, languages);
});
