import {Given} from "@cucumber/cucumber";
import assert = require("assert");
import {Page} from "playwright";
import {getInnerHTML} from "./helpers/dom.helpers";

/**
 * Gives the element a chance to appear, then waits for it to be hidden.
 */
const expectNotVisible = async (page: Page, selector: string, hiddenTimeout: number, appearTimeout = 2000) => {
    try {
        await page.waitForSelector(selector, {state: 'visible', strict: true, timeout: appearTimeout});
    } catch {
        // element never showed up: this is fine
    }

    await page.waitForSelector(selector, {state: 'hidden', strict: true, timeout: hiddenTimeout});
};

Given('_user sees {selector}', async function (selector) {
    await this.page.waitForSelector(selector, {state: 'visible', strict: true});
});

Given('_user sees {int} {selector}', async function (elementCount, selector) {
    await this.page.waitForSelector(selector, {state: 'visible'});

    const elements = await this.page.$$(selector);
    assert(elementCount === elements.length, `element count of ${selector} is ${elements.length} and should be ${elementCount}`);
});

Given('_user does not see {selector} after few seconds', async function (selector) {
    await expectNotVisible(this.page, selector, 2000);
});

Given('_user does not see {selector}', async function (selector) {
    await expectNotVisible(this.page, selector, 2000);
});

Given('_user does not see {selector} after {int} seconds', async function (selector, timeout) {
    await expectNotVisible(this.page, selector, timeout * 1000, 3000);
});

Given('_{selector} content is {string}', async function (selector, expectedValue) {
    const content = await getInnerHTML(this.page, selector);

    assert(content.trim() === expectedValue.trim(), `content of ${selector} is "${content.trim()}" and should be "${expectedValue.trim()}"`);
});
