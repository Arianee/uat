import {Then} from "cucumber";

Then('debug',{timeout:3600 * 1000},async function(){
    const readline = require('readline');

    function askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }

    const ans = await askQuestion("Press any key to continue to next step");
})
