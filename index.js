const http = require('http');
const get_page = require('./get_page.js');

const server = http.createServer(async (req, res) => {
    let url = req.url.substring(1);
    try {
        const page = await get_page(url);
        res.writeHead(page.status, page.headers);
        res.end(page.body);
    } catch (e) {
        res.writeHead(500);
        res.end(e.toString());
    }
});

const PORT = 3000;
server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
