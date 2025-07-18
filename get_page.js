async function get_page(url) {
    const response = await fetch(url);

    const contentType = response.headers.get('Content-Type').split('/');
    const headers = {
        'Content-Type': response.headers.get('Content-Type'),
    };

    let body;
    if (contentType[0] === 'text') body = await response.text();
    else body = new Uint8Array(await response.arrayBuffer());
    
    return {
        body,
        status: response.status,
        headers,
    };
}

module.exports = get_page;
