require('dotenv').config()
const { env } = process;

function parse(s) {
    try {
        return JSON.parse(s);
    } catch {
        if (typeof s === 'string') return s;
    }
}

global.port = parse(env.port) ?? 3000;
global.hostname = env.hostname ?? 'localhost';
global.secure = parse(env.secure) ?? false;
global.baseURL = `http${global.secure?'s':''}://${global.hostname}:${global.port}`;
global.followRedirects = parse(env.followRedirects) ?? true;

const purifyConfigs = {
    USE_PROFILES: { html: true },
    WHOLE_DOCUMENT: true,
    ADD_TAGS: [],
    ADD_ATTR: [],
    FORBID_TAGS: [],
};

if (!(parse(env.headEnabled) ?? false)) purifyConfigs.FORBID_TAGS.push('head')
if (parse(env.titleTagsEnabled) ?? false) purifyConfigs.ADD_TAGS.push('title');
if (parse(env.metaTagsEnabled) ?? false) purifyConfigs.ADD_TAGS.push('meta');
if (parse(env.cssEnabled) ?? false) {
    purifyConfigs.ADD_TAGS.push('link', 'style');
    purifyConfigs.ADD_ATTR.push('style');
}

global.purify = {
    enabled: parse(env.purifyEnabled) ?? true,
    configs: purifyConfigs,
};

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

server.listen(global.port, global.hostname, () => {
    console.log(`Server running at ${global.baseURL}`);
});
