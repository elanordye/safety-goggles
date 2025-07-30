# Safety Goggles
A simple web browsing proxy that provides various safety features.


## Dependencies
Before using this project, Ensure that node package manager is installed, then run the command `npm i` from the root of the project folder.


## Usage
Run either `npm run start` or `node index.js` from the root of the project folder to start the server. Once the server is running, navigate to `http://localhost:3000/`. Append any valid http(s) URL to it in order to view the page through the proxy.


## Configuration
There are two parts of the configuration file. The first are related to the server itself (i.e., the hostname, the port, etc.). The second is concerned with the purification of the HTML documents which the client requests.

### Server Configuration
By default, the server uses the hostname `localhost`, the port `3000`, and does not attempt to use SSL.
The following snippet represents the default values as they would be within the `.env` file:
```env
port = 3000
hostname = 'localhost'
secure = false
followRedirects = true
```

### Purification Configuration
Saftey Goggles completely purifies documents by default, disallowing all scripts and CSS, as well as `<meta>`, `<title>`, and `<head>` tags. This results in very barebones webpages, which is usually not quite what's wanted. If this were written in the `.env` file manually, it would look something like this:
```env
purifyEnabled = true
cssEnabled = false
allowUnknownProtocols = false
wholeDocument = false
headEnabled = false
titleTagsEnabled = false
metaTagsEnabled = false
```
However, for most users, I recommend using something like the included `example.env` (which allows `<head>`, `<meta>`, and `<title>` tags, as well as CSS, but still disallows scripts), and looks more like this:
```env
purifyEnabled = true
cssEnabled = true
allowUnknownProtocols = false
wholeDocument = true
headEnabled = true
titleTagsEnabled = true
metaTagsEnabled = true
```

### Configuration Reference
To make it easier to configure this program, I've written a list of each option and its function.
#### Server Configuration
- `port`
  - The port on which to run the program.
  - Type: Integer.
  - Default value: `3000`.
- `hostname`
  - The hostname on which to run the program.
  - Type: String.
  - Default value: `localhost`.
- `secure`
  - Whether to use SSL (currently does virtually nothing).
  - Type: Boolean.
  - Default value: `false`.
- `followRedirects`
  - Whether to automatically follow redirections.
  - Type: Boolean.
  - Default value: `false`.
#### Purification Configuration
- `purifyEnabled`
  - Whether to purify webpages using DOMPurify.
  - Type: Boolean.
  - Default value: `true`.
- `cssEnabled`
  - Whether to allow inline and file-based CSS to be used.
  - Type: Boolean.
  - Default value: `false`.
- `allowUnknownProtocols`
  - Whether to allow URIs with protocols which DOMPurify does not support.
  - Type: Boolean.
  - Default value: `false`.
- `wholeDocument`
  - Whether to return whole HTML documents (i.e., include the doctype, and the `<html>`, `<head>`, and `<body>` tags).
  - Type: Boolean.
  - Default value: `false`.
- `headEnabled`
  - Whether to allow `<head>` tags.
  - Type: Boolean.
  - Default value: `false`.
- `titleTagsEnabled`
  - Whether to allow `<title>` tags.
  - Type: Boolean.
  - Default value: `false`.
- `metaTagsEnabled`
  - Whether to allow `<meta>` tags.
  - Type: Boolean.
  - Default value: `false`.
