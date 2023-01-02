const fs = require("fs");
const http = require("http");

export const server=(configuration)=>{
    if (configuration.serve) {
        const port = configuration.serve.port || 4200;
        const host = 'localhost';

        const serverProcess = http.createServer((req, res) => {
            const serverRootPath = __dirname + '/../../' + configuration.serve.dir;
            const url = req.url === '/' ? '/index.html' : req.url;
            fs.readFile(serverRootPath + url, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404: File not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
            });
        });

        serverProcess.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
        return serverProcess;
    }
};
