import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";


Then('store value from process.env.{word} as {string}', async function (envPropertys, value) {
    this.store[value] = process.env[envPropertys];
});

Given('store value {interpolateValue} as {string}', async function (value, key) {
    if (value === 'randomNumber') {
        this.store[key] = getRandomInt();
    } else if (value === 'randomString') {
        this.store[key]=Math.random().toString(36).slice(-10);
    } else {
        this.store[key] = value;
    }
});
