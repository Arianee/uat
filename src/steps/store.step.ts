import {Given, Then} from "@cucumber/cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";
import {get} from 'lodash';
import faker from 'faker';

Then('_store value from process.env.{word} as {string}', async function (envProperty, key) {
    this.store[key] = process.env[envProperty];
});

Given('_store value {interpolateValue} as {string}', async function (value, key) {
    // value can be a faker.js path, e.g. 'internet.email'
    const fakerFunction = get(faker, value);

    if (typeof fakerFunction === "function") {
        this.store[key] = fakerFunction();
    } else if (value === 'randomNumber') {
        this.store[key] = getRandomInt();
    } else if (value === 'randomString') {
        this.store[key] = Math.random().toString(36).slice(-10);
    } else {
        this.store[key] = value;
    }
});

Given('_store value {interpolateValue} in local storage as {string}', async function (value, key) {
    await this.page.evaluate(({value, key}) => window.localStorage.setItem(key, value), {value, key});
});
