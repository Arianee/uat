// Copies the compiled common steps into the project that installed @arianee/uat.
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'common_steps');
// User's local directory (set by npm when running a lifecycle script)
const userPath = process.env.INIT_CWD || process.cwd();

fs.cpSync(source, path.join(userPath, 'common_steps'), { recursive: true, force: true });

console.log('You should add common_steps directory to your .gitignore');
