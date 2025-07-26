function html(content) {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(content);
    dom.window.document.querySelectorAll("a")
    .forEach(a => {
        if (a.href.substring(0, 1) !== '/') a.href = global.baseURL+'/'+a.href;
        else throw Error("FIX THIS URL THING IT'S RELATIVE TO THE PROXY'S ROOT BUT SHOULD BE RELATIVE TO THE ORIGINAL PAGE'S ROOT " + a.href)
    });
    return dom.serialize();
}

async function retrieve_resource(url) {
    const response = await fetch(url);

    const headers = {
        'Content-Type': response.headers.get('Content-Type'),
    };

    let body;
    contentType = response.headers.get('Content-Type').split(';')[0].split('/');
    if (contentType[0] === 'text') {
        if (contentType[1] === 'html') body = html(await response.text());
        else body = await response.text();
    } else body = new Uint8Array(await response.arrayBuffer());
    
    return {
        body,
        status: response.status,
        headers,
    };
}

module.exports = retrieve_resource;
