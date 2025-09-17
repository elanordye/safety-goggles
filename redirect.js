const url = require('url');

function redirect(res, uri) {
    const {query} = url.parse(req.url, true);
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end(`<!DOCTYPE html><head><meta http-equiv="Refresh" content="0; URL=${global.baseURL+'/'+query.url}" /></head><body><h1>Redirecting to ${query.url}</h1></body>`);
}

module.exports = redirect;
