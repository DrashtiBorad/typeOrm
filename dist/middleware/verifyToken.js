"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtPrivateKey = process.env.JSON_KEY;
const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        token = token.split(" ")[1];
        jsonwebtoken_1.default.verify(token, jwtPrivateKey, (error, valid) => {
            if (error) {
                res.status(400).json({ error: error });
            }
            else {
                next();
            }
        });
    }
    else {
        res.status(400).json({ error: "Enter Json WebToken" });
    }
};
exports.verifyToken = verifyToken;
