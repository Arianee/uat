import {Given} from "@cucumber/cucumber";
import assert = require("assert");
import color from 'onecolor';
import {Page} from "playwright";

const getComputedStyleProperty = async (page: Page, selectorName: string, propertyName: string): Promise<string> => {
    await page.waitForSelector(selectorName, {state: 'visible'});

    return page.evaluate(({selectorName, propertyName}) => {
        const element = document.querySelector(selectorName);
        return getComputedStyle(element).getPropertyValue(propertyName);
    }, {selectorName, propertyName});
};

['background-color', 'color'].forEach(propertyName => {
    Given(`_user sees ${propertyName} of {selector} as {interpolateValue}`, async function (selectorName, expectedColor) {
        const computedStyle = await getComputedStyleProperty(this.page, selectorName, propertyName);

        const colorOfElement = color(computedStyle).hex();
        const expectedHex = color(expectedColor).hex();

        assert(colorOfElement === expectedHex, `${propertyName} of ${selectorName} is ${colorOfElement} and should be ${expectedHex}`);
    });
});

Given(`_user sees font-family of {selector} as {interpolateValue}`, async function (selectorName, expectedFont) {
    const computedStyle = await getComputedStyleProperty(this.page, selectorName, 'font-family');

    assert(computedStyle === expectedFont, `font-family of ${selectorName} is ${computedStyle} and should be ${expectedFont}`);
});
