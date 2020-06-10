const {execSync, spawn} = require('child_process');


(async function () {
    let serverProcess;
    await new Promise(resolve => {
        serverProcess = spawn('node_modules/lite-server/bin/lite-server', ['-c', 'lite-server.conf.json']);
        serverProcess.stdout.on('data', resolve);
    });

    console.log("server launch");


    execSync('npm run e2e',    {stdio: 'inherit'});
    serverProcess.kill();
})();
