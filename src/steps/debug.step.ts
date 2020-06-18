import {Then} from "cucumber";

const readline = require('readline');

export function askQuestionBeforePassingToNextStep() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question("Press any key to continue to next step", ans => {
        rl.close();
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        resolve(ans);
    }))
}

Then('debug',{timeout:3600 * 1000},async function(){
    await askQuestionBeforePassingToNextStep();
})
