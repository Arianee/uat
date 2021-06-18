import {Given} from "@cucumber/cucumber";

Given('_user ordered favorite languages are {string}', async function (langagesValue) {
    const languages = langagesValue.split(',');

    const language = await this.page.addInitScript((languagesOfUser) => {
        Object.defineProperty(navigator, 'language', {
            get: function () {
                return languagesOfUser[0];
            }
        });
        Object.defineProperty(navigator, 'languages', {
            get: function () {
                return languagesOfUser;
            }
        });

        return navigator.language;
    }, languages);
});
