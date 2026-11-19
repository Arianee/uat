import {Given, Then} from "@cucumber/cucumber";
import fetch, {Headers} from 'node-fetch';
import assert = require("assert");

/** Turns a 2 columns gherkin table into [name, interpolatedValue] pairs. */
const interpolatedTable = (world, tableForm): [string, string][] =>
    tableForm.raw().map(([name, value]) => [name, world.utils.interpolate(value).toString()]);

const assertProperties = (actual, expected: [string, string][]) => {
    expected.forEach(([name, value]) => {
        const actualValue = String(actual?.[name]);
        assert(actualValue === value, `${name}: ${actualValue} is not ${value}`);
    });
};

Then('_api body of {string} is:', async function (title, body) {
    const interpolated = this.utils.interpolate(body);

    this.apiCall[title] = {
        ...this.apiCall[title],
        body: JSON.stringify(JSON.parse(interpolated))
    };
});

Then('_api user can {string} with api call:', async function (title, tableForm) {
    const {url, method, ...headers} = Object.fromEntries(interpolatedTable(this, tableForm));

    if (!url || !method) {
        throw new Error(`method and url should be defined for api call "${title}"`);
    }

    this.apiCall[title] = {
        headers: new Headers({
            'Content-Type': 'application/json',
            ...headers
        }),
        url,
        method
    };
});

Then('_api user make call {string}', async function (title) {
    const {url, method, body, headers} = this.apiCall[title];

    this.apiResult[title] = await fetch(url, {method, body, headers});
    try {
        this.apiBodyResult[title] = await this.apiResult[title].json();
    } catch {
        // response body is not JSON
    }
});

Then('_api result status of {string} should be:', async function (title, tableForm) {
    assertProperties(this.apiResult[title], interpolatedTable(this, tableForm));
});

Then('_api result body of {string} should be:', async function (title, tableForm) {
    assertProperties(this.apiBodyResult[title], interpolatedTable(this, tableForm));
});

Given('_store value from api call {string} body property {interpolateValue} as {string}',
    async function (title, property, key) {
        this.store[key] = this.apiBodyResult[title][property];
    });
