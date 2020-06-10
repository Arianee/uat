import { After, AfterAll, Before, BeforeAll } from 'cucumber';
import { Browser, Page } from 'puppeteer';
import {utils} from "./helpers/utils";

const puppeteer = require('puppeteer');

declare module 'cucumber' {

    interface World {
        browser: Browser,
        page: Page,
        utils:any,
    }
}

Before(async function () {
    this.browser = await puppeteer.launch({
        args: [
            '--disable-web-security',
            '--allow-no-sandbox-job'
        ],
        slowMo: 150,
        headless: process.env.headless || true,
        defaultViewport: { width: 920, height: 640 }
    });

    this.store={};
    this.utils=utils(this.store)
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('puppeteer');

});

After(async function () {
    await this.browser.close();
});
