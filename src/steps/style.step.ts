import {Given} from "@cucumber/cucumber";
import assert = require("assert");
import color from 'onecolor';

const colorProperties = ['background-color', 'color'];

colorProperties.map(propertyName => {
    return Given(`_user sees ${propertyName} of {selector} as {interpolateValue}`, async function (selectorName, fontColor) {
        await this.page.waitForSelector(selectorName, {
            visible: true
        });

        const computedStyle = await this.page.evaluate((data) => {
            const {selectorName, propertyName} = data;
            const element = document.querySelector(selectorName);
            return getComputedStyle(element).getPropertyValue(propertyName);
        }, {selectorName, propertyName});

        const colorOfElement = color(computedStyle).hex();
        const expectedColor = color(fontColor).hex();

        assert(colorOfElement === expectedColor);
    });
});

Given(`_user sees font-family of {selector} as {interpolateValue}`, async function (selectorName, expectedFont) {
    await this.page.waitForSelector(selectorName, {
        visible: true
    });

    const computedStyle = await this.page.evaluate((data) => {
        const {selectorName, propertyName} = data;
        const element = document.querySelector(selectorName);
        return getComputedStyle(element).getPropertyValue(propertyName);
    }, {selectorName, propertyName: 'font-family'});

    console.log(computedStyle);
    assert(computedStyle === expectedFont);
});
