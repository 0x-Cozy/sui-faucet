"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./utils/config");
const faucet_1 = __importDefault(require("./routes/faucet"));
const discord_1 = __importDefault(require("./routes/discord"));
const admin_1 = __importDefault(require("./routes/admin"));
const refund_1 = __importDefault(require("./routes/refund"));
const app = (0, express_1.default)();
app.set('trust proxy', true);
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: config_1.config.cors.origin,
    credentials: true
}));
// routes
app.use('/api/faucet', faucet_1.default);
app.use('/api/discord', discord_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/refund', refund_1.default);
// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
//# sourceMappingURL=app.js.map