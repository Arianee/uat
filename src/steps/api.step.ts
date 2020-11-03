import {Then} from "cucumber";
import fetch, {Headers} from 'node-fetch';
import assert = require("assert");


Then('_api user can {string} with api call:', async function (title, tableForm) {
    const properties = tableForm.raw();

    const prepareProperties = properties.reduce((acc, [name, value]) => {
        const trueValue = this.utils.interpolate(value).toString();
        acc[name] = trueValue;
        return acc;
    }, {});

    const {url, method, body, ...headers} = prepareProperties;

    if (!url || !method) {
        console.error(prepareProperties);
        throw new Error('method and url should be defined');
    }

    this.apiResult[title] = await fetch(url, {method, body, headers: new Headers(headers)});
});

Then('_api result status of {string} should be:', async function (title, tableForm) {

    const properties = tableForm.raw();
    const prepareProperties = properties.map(([name, value]) => {
        const trueValue = this.utils.interpolate(value).toString();
        return [name, trueValue];
    }, {});

    const apiResult = this.apiResult[title];

    prepareProperties.forEach(([name, value]) => {
        assert(apiResult[name].toString() === value.toString());
    })
});

Then('_api result body of {string} should be:', async function (title, tableForm) {

    const properties = tableForm.raw();
    const prepareProperties = properties.map(([name, value]) => {
        const trueValue = this.utils.interpolate(value).toString();
        return [name, trueValue];
    }, {});

    const apiResult = await this.apiResult[title].json();

    prepareProperties.forEach(([name, value]) => {
        assert(apiResult[name].toString() === value.toString());
    })
});

