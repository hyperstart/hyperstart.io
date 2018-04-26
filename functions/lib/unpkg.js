"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const URL = "https://unpkg.com/";
function getUrl(payload) {
    const { pkg, version, file } = payload;
    let url = URL + pkg;
    if (version) {
        url += "@" + version;
    }
    if (file) {
        url += file.startsWith("/") ? file : "/" + file;
    }
    return url;
}
function extractFile(url) {
    const segments = url.replace(URL, "").split("/");
    return url
        .replace(URL, "")
        .split("/")
        .slice(1)
        .join("/");
}
function extractVersion(url) {
    const urlSegments = url.replace(URL, "").split("/");
    const segments = urlSegments[0].split("@");
    return segments[segments.length - 1];
}
function get(payload) {
    const { pkg } = payload;
    let url;
    return fetch_1.fetch(getUrl(payload))
        .then(response => {
        url = response.url;
        return response.text();
    })
        .then(content => {
        const file = payload.file || extractFile(url);
        const version = payload.version || extractVersion(url);
        return { content, url, pkg, file, version };
    });
}
exports.get = get;
// function getMetaUrl(payload: GetMetaPayload) {
//   const { pkg, version } = payload
//   if (version) {
//     return URL + pkg + "@" + version + "/?meta"
//   }
//   return URL + pkg + "/?meta"
// }
// export interface GetMetaPayload {
//   pkg: string
//   version?: string
// }
// export function getMeta(payload: GetMetaPayload) {
//   return fetch(getMetaUrl(payload))
//     .then(response => response.json())
//     .then(json => {
//       console.log("Got meta", json)
//     })
// }
//# sourceMappingURL=unpkg.js.map