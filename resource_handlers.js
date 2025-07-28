const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function startsWithHTTP(url) {
    const regex = /^(http(s?)):\/\//i;
    return regex.test(url);
}

function replaceURLs(currentOrigin, newOrigin) {
    return attribute => {
        return node => {
            if (startsWithHTTP(node[attribute])) node[attribute] = newOrigin+'/'+node[attribute];
            else node[attribute] = [newOrigin, currentOrigin, node[attribute]].join('/');
        };
    };
}

function html(url, content) {
    if (global.purify.enabled) {
        const createDOMPurify = require('dompurify');
        const DOMPurify = createDOMPurify((new JSDOM('')).window);
        content = '<!DOCTYPE html>\n'+DOMPurify.sanitize(content, global.purify.configs);
    }

    const dom = new JSDOM(content, {url});

    const replacer = replaceURLs(dom.window.location.origin, global.baseURL);
    ['href', 'src', 'srcset', 'poster', 'action'].forEach(attribute => {
        dom.window.document.querySelectorAll(`[${attribute}]`)
        .forEach(replacer(attribute));
    });

    const base = dom.window.document.createElement('base');
    base.href = global.baseURL+'/'+dom.window.location.origin;
    dom.window.document.head.appendChild(base);

    return dom.serialize();
}

async function retrieve_resource(url) {
    const response = await fetch(url, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
        if (!global.followRedirects) return {
            status: 200,
            body: 'Redirect disallowed.\nDestination URL: '+response.headers.get('Location'),
        }
        const headers = {};
        if (response.headers.get('Location').substring(0, 1) === '/') {
            const dom = new JSDOM('', {url});
            headers.Location = global.baseURL + '/' + dom.window.location.origin + response.headers.get('Location');
        } else headers.Location = global.baseURL + '/' + response.headers.get('Location');
        return {
            status: response.status,
            headers,
        }
    }

    const headers = {
        'Content-Type': response.headers.get('Content-Type'),
    };

    let body;
    contentType = response.headers.get('Content-Type').split(';')[0].split('/');
    if (contentType[0] === 'text') {
        if (contentType[1] === 'html') body = html(url, await response.text());
        else body = await response.text();
    } else body = new Uint8Array(await response.arrayBuffer());
    
    return {
        body,
        status: response.status,
        headers,
    };
}

module.exports = retrieve_resource;
