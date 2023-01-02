import {
    After,
    Before,
    AfterAll,
    BeforeAll,
    defineParameterType,
    setDefaultTimeout,
    setDefinitionFunctionWrapper,
    Status
} from '@cucumber/cucumber';
import {utils} from "./helpers/utils";
import {askQuestionBeforePassingToNextStep} from "./debug.step";
import {start} from "./helpers/uatConfig/uatConfig";
import playwright, {Page, Browser} from 'playwright';
import {sendSlackMessage} from "./helpers/sendSlack";
import {execSync} from "child_process";
import process from "process";
const readFileSync = require('fs').readFileSync;
const writeFileSync=require('fs').writeFileSync;

let configurationFile;
let hasBeenInErrorOnce = false;
const uatConfigJSON = process.env.uatConfig || './uat.config.json';
try {
    configurationFile = readFileSync(uatConfigJSON, {encoding: 'utf8'});
} catch {
    console.log("you can use uat.config.json to set your personalized configuration")
}
const {configuration, serve, walletConnectBridgeStart} = start(configurationFile);

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

let server;
let walletConnectBridge;
BeforeAll(async function () {
    server = await serve();
    walletConnectBridge = await walletConnectBridgeStart();
});

AfterAll(async function () {
    if(walletConnectBridge){
        execSync('docker-compose stop')
        walletConnectBridge.kill();
    }

    const errorCode = hasBeenInErrorOnce ? 1 : 0;
    process.exit(errorCode);
});

Before(async function () {
    this.browser = await playwright[configuration.configuration.browser]
        .launch({
        slowMo:  configuration.configuration.slowMotion,
            headless: configuration.configuration.headless
    });

    this.configuration = configuration;
    this.store={};
    this.apiResult={};
    this.apiBodyResult={};
    this.apiCall={};
    this.utils=utils(this.store)
    this.page = await this.browser
        .newPage();
    this.logValues=[];

    await this.page.on('console',async (msg) => {
        this.logValues.push({
            text:msg.text(),
            type:msg.type(),
            location:msg.location(),
            timestamp:new Date().toTimeString()
        });
    });

});

After(async function (scenario) {


    if (scenario.result.status === Status.FAILED) {

        hasBeenInErrorOnce = true;
        if (!this.configuration.configuration.screenshotOnError) {
            console.log('This step has failed. To make a screenshot set process.env.screenshotOnError=true');
        }

        if (this.page && this.configuration.configuration.screenshotOnError) {
            writeFileSync('./uat-debug/full_brower_log.json',JSON.stringify(this.logValues,null,2))
            await this.page.screenshot({path: './uat-debug/failed_step.png'});

            console.log('check screenshot failed_step.png');
            if (this.configuration.configuration.slack) {

                let gitCommit;
                try {
                    gitCommit = execSync('git rev-parse HEAD');
                } catch (e) {
                    console.error("git is not installed");
                }

                const {channel, token} = this.configuration.configuration.slack;
                await sendSlackMessage({
                    channel,
                    token,
                    imgPath: 'failed_step.png',
                    message: `One of your test failed ${gitCommit}: ${JSON.stringify(scenario.result)} `
                })
            }
        }
    }
    await this.browser.close();


});

