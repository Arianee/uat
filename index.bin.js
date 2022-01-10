#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path');

const commandLineArgs=[];

process.argv.slice(2).forEach(function (val, index, array) {
    commandLineArgs.push(val)
});

const commonStepsPath = path.join(__dirname, 'common_steps','*.step.js');
const customStepsPath = path.join(process.cwd(), 'custom_steps','*.step.js');

const command=`npx cucumber-js --require "${commonStepsPath}" --require "${customStepsPath}" -f @cucumber/pretty-formatter`;
console.log(command);
execSync(command, {stdio: 'inherit'});
