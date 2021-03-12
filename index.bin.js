#!/usr/bin/env node
const { execSync } = require('child_process')

const commandLineArgs=[];

process.argv.slice(2).forEach(function (val, index, array) {
    commandLineArgs.push(val)
});

const command=`./node_modules/.bin/cucumber-js --require './common_steps/*.step.js' --require './node_modules/@arianee/uat/common_steps/*.step.js' -f @cucumber/pretty-formatter ${commandLineArgs.join(' ')}`;
console.log(command);
execSync(command, {stdio: 'inherit'});
