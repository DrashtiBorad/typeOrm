"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("./controller/user");
const categories_1 = require("./controller/categories");
const products_1 = require("./controller/products");
const verifyToken_1 = require("./middleware/verifyToken");
const cart_1 = require("./controller/cart");
const favourite_1 = require("./controller/favourite");
exports.router = express_1.default.Router();
// User Router
exports.router.post("/register", user_1.registration);
exports.router.post("/login", user_1.logIn);
exports.router.post("/sendOtp", user_1.sendOtp);
exports.router.post("/otp-verify", user_1.otpVerify);
exports.router.post("/reset-password", user_1.resetPassword);
// Categories
exports.router.post("/add-category", verifyToken_1.verifyToken, categories_1.addProductCategories); // For admin
exports.router.get("/get-categories", verifyToken_1.verifyToken, categories_1.getProductCategories);
// Products (for admin)
exports.router.post("/add-products", verifyToken_1.verifyToken, products_1.addProducts);
exports.router.get("/get-products", verifyToken_1.verifyToken, products_1.getProducts);
exports.router.delete("/delete-products", verifyToken_1.verifyToken, products_1.deleteProducts);
exports.router.put("/update-products", verifyToken_1.verifyToken, products_1.updateProducts);
// cart Items
exports.router.post("/add-to-cart", verifyToken_1.verifyToken, cart_1.addToCart);
exports.router.get("/cart-items", verifyToken_1.verifyToken, cart_1.getItemsFromCart);
exports.router.delete("/delete-items", verifyToken_1.verifyToken, cart_1.removeFormCart);
// Faviourite Items
exports.router.post("/add-to-faviourite", verifyToken_1.verifyToken, favourite_1.addToFaviourite);
exports.router.get("/get-faviourite-items", verifyToken_1.verifyToken, favourite_1.getFaviouriteItems);
exports.router.delete("/delete-faviourite", verifyToken_1.verifyToken, favourite_1.removeFaviouriteItems);
