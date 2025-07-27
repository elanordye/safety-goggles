const http = require('http');
const retrieve_resource = require('./resource_handlers.js');

const server = http.createServer(async (req, res) => {
    let url = req.url.substring(1); // Excludes the initial forward slash
    try {
        // Try to retrieve the requested resource
        const {status, headers, body} = await retrieve_resource(url);
        res.writeHead(status, headers);
        res.end(body);
    } catch (e) {
        // Send errors to the client
        res.writeHead(500);
        res.end(e.toString());
    }
});

global.port = 3000;
global.hostname = 'localhost';
global.secure = false;
global.baseURL = `http${global.secure?'s':''}://${global.hostname}:${global.port}`;

server.listen(global.port, global.hostname, () => {
    console.log(`Server running at ${global.baseURL}`);
});
