import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";


Then('store value from process.env.{word} as {string}', async function (envPropertys, value) {
    this.store[value] = process.env[envPropertys];
});

Given('store value {interpolateValue} as {string}', async function (value, key) {
    if (value === 'randomNumber') {
        this.store[key] = getRandomInt();
    } else {
        this.store[key] = value;
    }
});
