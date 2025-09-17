const fileSystem = require('fs');
const path = require('path');

function loadHtml(res, file) {
    const filePath = path.join(__dirname, file);
    const stat = fileSystem.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8',
        'Content-Length': stat.size,
    });
    const readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(res);
}

module.exports = loadHtml;
