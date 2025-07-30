const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const convertURIs = require('./convertURIs.js');

function css(url, content) {
    const currentOrigin = new JSDOM('', {url}).window.location.origin;
    return content.replace(/url\(['"]?\/?(.+?)['"]?\)/g, (match, uri) => {
        if (!(uri.startsWith('data:') || uri.startsWith('blob:'))) uri = '/' + uri;
        return `url('${convertURIs(uri, currentOrigin, global.baseURL)}')`
        return match;
    });
}

module.exports = css;
