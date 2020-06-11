var gentlyCopy = require('gently-copy');

var filesToCopy = ['common_steps'];

// User's local directory
var userPath = process.env.INIT_CWD;

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath, {overwrite: true});

console.log("You should add common_steps directory to your .gitignore");
