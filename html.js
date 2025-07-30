const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const convertURIs = require('./convertURIs.js');
const css = require('./css.js');

function html(url, content) {
    if (global.purify.enabled) {
        const createDOMPurify = require('dompurify');
        const DOMPurify = createDOMPurify((new JSDOM('')).window);
        content = '<!DOCTYPE html>\n'+DOMPurify.sanitize(content, global.purify.configs);
    }

    const dom = new JSDOM(content, {url});

    dom.window.document.querySelectorAll('[style]').forEach(node => {
        if (!node.style) return;
        node.setAttribute('style', css(url, node.getAttribute('style')));
    });
    Array.from(dom.window.document.getElementsByTagName('style')).forEach(node => {
        if (!node.textContent) return;
        node.textContent = css(url, node.textContent);
    });

    ['href', 'src', 'srcset', 'poster', 'action'].forEach(attribute => {
        dom.window.document.querySelectorAll(`[${attribute}]`)
        .forEach(node => {
            node[attribute] = convertURIs(node[attribute], dom.window.location.origin, global.baseURL)
        });
    });

    const base = dom.window.document.createElement('base');
    base.href = global.baseURL+'/'+dom.window.location.origin;
    dom.window.document.head.appendChild(base);

    return dom.serialize();
}

module.exports = html;
