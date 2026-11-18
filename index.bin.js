#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const commonStepsPath = path.join(__dirname, 'common_steps', '*.step.js');
const customStepsPath = path.join(process.cwd(), 'custom_steps', '*.step.js');

// Resolve the cucumber binary installed alongside @arianee/uat so that the
// steps and the runner always share the same @cucumber/cucumber instance.
const cucumberBin = require.resolve('@cucumber/cucumber/bin/cucumber-js');

const args = [
    cucumberBin,
    '--require', commonStepsPath,
    '--require', customStepsPath,
    '-f', '@cucumber/pretty-formatter',
    ...process.argv.slice(2)
];

console.log(['cucumber-js', ...args.slice(1)].join(' '));

const { status, error } = spawnSync(process.execPath, args, { stdio: 'inherit' });

if (error) {
    console.error(error);
    process.exit(1);
}
process.exit(status === null ? 1 : status);
