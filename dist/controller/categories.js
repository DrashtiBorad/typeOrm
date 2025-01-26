"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductCategories = exports.addProductCategories = void 0;
const database_1 = require("../config/database");
const categories_1 = require("../entities/categories");
const categoriesDataSource = database_1.appDataSource.getRepository(categories_1.Categories);
const addProductCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoriesName } = req.body;
    console.log("categoriesNamecategoriesName", categoriesName);
    const findCategories = yield categoriesDataSource
        .createQueryBuilder("categories")
        .where("categories.categoriesName = :categoriesName", { categoriesName })
        .getOne();
    if (!findCategories) {
        yield categoriesDataSource
            .createQueryBuilder()
            .insert()
            .values({
            categories_name: categoriesName,
        })
            .execute();
        res.status(200).json({ message: "Category add successfully" });
    }
    else {
        res.status(400).json({ message: "This category is already added." });
    }
});
exports.addProductCategories = addProductCategories;
const getProductCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield categoriesDataSource
            .createQueryBuilder("categories")
            .delete()
            .execute();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getProductCategories = getProductCategories;
