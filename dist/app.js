"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const publications_routes_1 = __importDefault(require("./routes/publications.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const coworking_routes_1 = __importDefault(require("./routes/coworking.routes"));
const purchases_routes_1 = __importDefault(require("./routes/purchases.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const reservations_routes_1 = __importDefault(require("./routes/reservations.routes"));
const dev_routes_1 = __importDefault(require("./routes/dev.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.get("/", async (_, res) => {
    try {
        const result = await db_1.default.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Nexus API funcionando",
            database: "connected",
            time: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            database: "error",
        });
    }
});
app.use("/api/publications", publications_routes_1.default);
app.use("/api/categories", categories_routes_1.default);
app.use("/api/coworking-spaces", coworking_routes_1.default);
app.use("/api/purchases", purchases_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/coworking-reservations", reservations_routes_1.default);
app.use("/api/dev", dev_routes_1.default);
exports.default = app;
