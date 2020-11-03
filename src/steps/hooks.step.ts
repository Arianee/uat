import {After, Before, defineParameterType} from 'cucumber';
import {Browser, Page} from 'puppeteer';
import {utils} from "./helpers/utils";
import {setDefinitionFunctionWrapper, setDefaultTimeout} from "cucumber";
import {askQuestionBeforePassingToNextStep} from "./debug.step";

if (process.env.DEBUG=='true') {
    setDefaultTimeout(3600 * 1000);
}
setDefinitionFunctionWrapper(function (fn) {
    return async function (...args) {
        try {
            if (process.env.DEBUG=='true') {
                await askQuestionBeforePassingToNextStep();
            }
            return await fn.apply(this, args);
        } catch (ex) {
            throw ex;
        }
    };
});
const puppeteer = require('puppeteer');

declare module 'cucumber' {

    interface World {
        browser: Browser,
        page: Page,
        utils:any,
    }
}


defineParameterType({
    regexp: /'(.*?)'/,
    transformer(selectorName) {
        return    this.utils.selectorFactory(selectorName);
    },
    name: 'selector',
    useForSnippets: true
});

defineParameterType({
    regexp: /'(.*?)'/,
    transformer(string) {
        return this.utils.interpolate(string).toString();
    },
    name: 'interpolateValue',
    useForSnippets: true
});


Before(async function () {

    const isHeadless=process.env.headless !== undefined ? process.env.headless=='true' : true;

    this.browser = await puppeteer.launch({
        args: [
            '--disable-web-security',
            '--allow-no-sandbox-job'
        ],
        slowMo: 150,
        headless: isHeadless,
        defaultViewport: { width: 340, height: 640 }
    });

    this.store={};
    this.apiResult={};
    this.utils=utils(this.store)
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('puppeteer');

    console.info("puppeteer page is accessible at this.page");

});

After(async function () {
    await this.browser.close();
});
