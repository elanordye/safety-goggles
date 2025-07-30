function convertURIs(uri, currentOrigin, newOrigin) {
    if (!uri) return;
    if (uri.startsWith('http')) return newOrigin + '/' + uri;
    else if (uri.startsWith('/')) return newOrigin + '/' + currentOrigin + uri;
    else return newOrigin+'/'+uri;
}

module.exports = convertURIs;
