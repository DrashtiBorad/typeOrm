"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.router);
dotenv_1.default.config();
const port = 3003;
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server started successfully." });
});
database_1.appDataSource
    .initialize()
    .then(() => {
    console.log("connected");
    app.listen(port, () => {
        console.log(`server starting at port ${port}`);
    });
})
    .catch((err) => console.log("err", err));
