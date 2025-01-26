import express from "express";
import {
  registration,
  logIn,
  otpVerify,
  resetPassword,
  sendOtp,
} from "./controller/user";

import {
  addProductCategories,
  getProductCategories,
} from "./controller/categories";
import {
  addProducts,
  deleteProducts,
  getProducts,
  updateProducts,
} from "./controller/products";
import { verifyToken } from "./middleware/verifyToken";
import { addToCart, getItemsFromCart, removeFormCart } from "./controller/cart";
import {
  addToFaviourite,
  getFaviouriteItems,
  removeFaviouriteItems,
} from "./controller/favourite";

export const router = express.Router();

// User Router

router.post("/register", registration);
router.post("/login", logIn);
router.post("/sendOtp", sendOtp);
router.post("/otp-verify", otpVerify);
router.post("/reset-password", resetPassword);

// Categories
router.post("/add-category", verifyToken, addProductCategories); // For admin
router.get("/get-categories", verifyToken, getProductCategories);

// Products (for admin)
router.post("/add-products", verifyToken, addProducts);
router.get("/get-products", verifyToken, getProducts);
router.delete("/delete-products", verifyToken, deleteProducts);
router.put("/update-products", verifyToken, updateProducts);

// cart Items
router.post("/add-to-cart", verifyToken, addToCart);
router.get("/cart-items", verifyToken, getItemsFromCart);
router.delete("/delete-items", verifyToken, removeFormCart);

// Faviourite Items
router.post("/add-to-faviourite", verifyToken, addToFaviourite);
router.get("/get-faviourite-items", verifyToken, getFaviouriteItems);
router.delete("/delete-faviourite", verifyToken, removeFaviouriteItems);
