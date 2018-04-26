"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const getParentPath = (path) => {
    if (path.length === 0) {
        throw new Error("Path is empty.");
    }
    return path.slice(0, path.length - 1);
};
const getSegments = (path) => {
    let segments = path.split("/");
    if (segments.length === 0) {
        return segments;
    }
    if (segments[0] === "") {
        segments = segments.slice(1);
    }
    if (segments.length > 0 && segments[segments.length - 1] === "") {
        segments = getParentPath(segments);
    }
    return segments;
};
const KNOWN_EXTENSIONS = {
    js: true,
    jsx: true,
    ts: true,
    tsx: true,
    html: true,
    css: true,
    json: true
};
/**
 *
 */
function resolveId(importee, importer) {
    // index.js
    if (!importer) {
        return importee;
    }
    // local import
    if (importee.startsWith(".")) {
        const folder = getParentPath(getSegments(importer));
        const local = getSegments(importee);
        const segments = folder.concat(local);
        const result = [];
        for (const segment of segments) {
            if (segment === "..") {
                result.pop();
            }
            else if (segment !== ".") {
                result.push(segment);
            }
        }
        const resolved = "/" + result.join("/");
        const extension = utils_1.getExtension(resolved);
        return KNOWN_EXTENSIONS[extension] ? resolved : resolved + ".js";
    }
    // dependency
    return importee;
}
exports.resolveId = resolveId;
//# sourceMappingURL=resolveId.js.map