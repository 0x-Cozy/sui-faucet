"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const faucet_1 = __importDefault(require("./routes/faucet"));
const discord_1 = __importDefault(require("./routes/discord"));
const admin_1 = __importDefault(require("./routes/admin"));
const refund_1 = __importDefault(require("./routes/refund"));
const app = (0, express_1.default)();
app.set('trust proxy', true);
// middleware
app.use(express_1.default.json());
// CORS explicit headers
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
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