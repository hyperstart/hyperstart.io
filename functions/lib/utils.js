"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getExtension(path) {
    const segments = (path || "").split(".");
    if (segments.length === 0) {
        throw new Error('Cannot get extension from path: "' + path + '"');
    }
    return segments[segments.length - 1];
}
exports.getExtension = getExtension;
/**
 * Transform possible error objets in a message.
 */
exports.getErrorMessage = (error) => {
    if (typeof error === "string") {
        return error;
    }
    return error.message;
};
//# sourceMappingURL=utils.js.map