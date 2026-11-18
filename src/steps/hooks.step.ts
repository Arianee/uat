import {
    After,
    AfterAll,
    Before,
    BeforeAll,
    defineParameterType,
    setDefaultTimeout,
    setDefinitionFunctionWrapper,
    Status
} from '@cucumber/cucumber';
import {utils} from "./helpers/utils";
import {askQuestionBeforePassingToNextStep} from "./debug.step";
import {start} from "./helpers/uatConfig/uatConfig";
import playwright, {Browser, Page} from 'playwright';
import {sendSlackMessage} from "./helpers/sendSlack";
import {ChildProcess, execSync} from "child_process";
import {mkdirSync, readFileSync, writeFileSync} from "fs";
import path from "path";

const kill = require('kill-port');

const uatConfigJSON = process.env.uatConfig || './uat.config.json';
let configurationFile: string | undefined;
try {
    configurationFile = readFileSync(uatConfigJSON, {encoding: 'utf8'});
} catch {
    console.log("you can use uat.config.json to set your personalized configuration");
}
const {configuration, serve} = start(configurationFile);

let hasBeenInErrorOnce = false;

if (configuration.configuration.debug) {
    setDefaultTimeout(3600 * 1000);
}

setDefinitionFunctionWrapper(function (fn) {
    return async function (...args) {
        if (configuration.configuration.debug) {
            await askQuestionBeforePassingToNextStep();
        }
        return fn.apply(this, args);
    };
});

declare module '@cucumber/cucumber' {
    interface World {
        browser: Browser,
        page: Page,
        utils: any,
    }
}

defineParameterType({
    regexp: /'(.*?)'/,
    transformer(selectorName) {
        return this.utils.selectorFactory(selectorName);
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

let server: ChildProcess | undefined;

BeforeAll(async function () {
    server = await serve();
});

AfterAll(async function () {
    if (server) {
        // npx is launching http-server in a child process so we need to kill it "manually"
        await kill(configuration.serve.port, 'tcp').catch(() => undefined);
    }

    process.exit(hasBeenInErrorOnce ? 1 : 0);
});

Before(async function () {
    const {browser, slowMotion, headless} = configuration.configuration;

    this.browser = await playwright[browser].launch({slowMo: slowMotion, headless});

    this.configuration = configuration;
    this.store = {};
    this.apiResult = {};
    this.apiBodyResult = {};
    this.apiCall = {};
    this.utils = utils(this.store);
    this.page = await this.browser.newPage();
    this.logValues = [];

    this.page.on('console', (msg) => {
        this.logValues.push({
            text: msg.text(),
            type: msg.type(),
            location: msg.location(),
            timestamp: new Date().toTimeString()
        });
    });
});

const getGitCommit = (): string | undefined => {
    try {
        return execSync('git rev-parse HEAD', {stdio: ['ignore', 'pipe', 'ignore']}).toString().trim();
    } catch {
        console.error("git is not installed");
        return undefined;
    }
};

After(async function (scenario) {
    const {screenshotOnError, pathLogs, slack} = this.configuration.configuration;

    if ([Status.FAILED, Status.UNKNOWN, Status.UNDEFINED].includes(scenario.result.status)) {
        hasBeenInErrorOnce = true;

        if (!screenshotOnError) {
            console.log('This step has failed. To make a screenshot set process.env.screenshotOnError=true');
        }

        if (this.page && screenshotOnError) {
            const screenshotPath = path.join(pathLogs, 'failed_step.png');

            mkdirSync(pathLogs, {recursive: true});
            writeFileSync(path.join(pathLogs, 'full_brower_log.json'), JSON.stringify(this.logValues, null, 2));
            await this.page.screenshot({path: screenshotPath});
            console.log(`check screenshot ${screenshotPath}`);

            if (slack) {
                const {channel, token} = slack;
                await sendSlackMessage({
                    channel,
                    token,
                    imgPath: screenshotPath,
                    message: `One of your test failed ${getGitCommit()}: ${JSON.stringify(scenario.result)} `
                }).catch(e => console.error('Could not send slack message', e));
            }
        }
    }

    await this.browser.close();
});
