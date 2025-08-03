"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpired = exports.formatTimeAgo = exports.getTimestampFromDate = exports.getCurrentTimestamp = void 0;
const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};
exports.getCurrentTimestamp = getCurrentTimestamp;
const getTimestampFromDate = (date) => {
    return Math.floor(date.getTime() / 1000);
};
exports.getTimestampFromDate = getTimestampFromDate;
const formatTimeAgo = (timestamp) => {
    const now = (0, exports.getCurrentTimestamp)();
    const diff = now - timestamp;
    if (diff < 60)
        return `${diff} seconds ago`;
    if (diff < 3600)
        return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400)
        return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
};
exports.formatTimeAgo = formatTimeAgo;
const isExpired = (timestamp, ttlSeconds) => {
    const now = (0, exports.getCurrentTimestamp)();
    return (now - timestamp) > ttlSeconds;
};
exports.isExpired = isExpired;
//# sourceMappingURL=time.js.map