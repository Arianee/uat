import {Given, Then} from "cucumber";
import {getRandomInt} from "./helpers/selectDataAttribute";
import {get} from 'lodash';
import faker from 'faker';


Then('_store value from process.env.{word} as {string}', async function (envPropertys, value) {
    this.store[value] = process.env[envPropertys];
});

Given('_store value {interpolateValue} as {string}', async function (value, key) {
    const isFake = get(faker, value);

    if (isFake && typeof isFake==="function") {
        this.store[key]=isFake();
    } else if (value === 'randomNumber') {
        this.store[key] = getRandomInt();
    } else if (value === 'randomString') {
        this.store[key]=Math.random().toString(36).slice(-10);
    } else {
        this.store[key] = value;
    }
});

