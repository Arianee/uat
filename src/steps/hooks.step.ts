import {After, Before, defineParameterType, setDefaultTimeout, setDefinitionFunctionWrapper, Status} from '@cucumber/cucumber';
import {Browser, Page} from 'puppeteer';
import {utils} from "./helpers/utils";
import {askQuestionBeforePassingToNextStep} from "./debug.step";
import {start} from "./helpers/uatConfig/uatConfig";

const readFileSync = require('fs').readFileSync;

const configurationFile = readFileSync('./uat.config.json', {encoding: 'utf8'});
const {configuration, serve} = start(configurationFile);

const puppeteer = require('puppeteer');

if (configuration.configuration.debug) {
    setDefaultTimeout(3600 * 1000);
}
setDefinitionFunctionWrapper(function (fn) {
    return async function (...args) {
        try {
            if (configuration.configuration.debug) {
                await askQuestionBeforePassingToNextStep();
            }
            return await fn.apply(this, args);
        } catch (ex) {
            throw ex;
        }
    };
});

declare module '@cucumber/cucumber' {

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


    this.browser = await puppeteer.launch({
        args: [
            '--disable-web-security',
            '--allow-no-sandbox-job'
        ],
        slowMo:  configuration.configuration.slowMotion,
        headless: configuration.configuration.headless,
        defaultViewport: { width: 340, height: 640 }
    });

    this.configuration = configuration;
    this.server =await serve();
    this.store={};
    this.apiResult={};
    this.apiBodyResult={};
    this.apiCall={};
    this.utils=utils(this.store)
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('puppeteer');

    console.info("puppeteer page is accessible at this.page");

});

After(async function (scenario) {
    if (scenario.result.status === Status.FAILED) {
        if (!this.configuration.configuration.screenshotOnError) {
            console.log('This step has failed. To make a screenshot set process.env.screenshotOnError=true');
        }

        if (this.page && this.configuration.configuration.screenshotOnError) {
            await this.page.screenshot({path: 'failed_step.png'});
            console.log('check screenshot failed_step.png')
        }
    }
    await this.browser.close();
    if (this.server) {
        this.server.kill();
    }

});

