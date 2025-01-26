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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProducts = exports.deleteProducts = exports.getProducts = exports.addProducts = exports.client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const database_1 = require("../config/database");
const products_1 = require("../entities/products");
const formidable_1 = require("formidable");
const fs_1 = __importDefault(require("fs"));
const productDataSource = database_1.appDataSource.getRepository(products_1.Product);
exports.client = new client_s3_1.S3({
    region: "ap-south-1",
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESSKEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    },
});
const addProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const form = new formidable_1.IncomingForm({
        multiples: false,
        keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: "File upload failed" });
        }
        const file = files.image;
        if (!file) {
            return res.status(400).json({ error: "Image is required" });
        }
        const fileStream = fs_1.default.createReadStream(file.map((list) => list.filepath)[0]);
        const uniqueKey = `${Date.now()}-${file.map((list) => list.originalFilename)}`;
        try {
            yield exports.client.putObject({
                Bucket: process.env.BUCKET_NAME,
                Key: uniqueKey,
                Body: fileStream,
                ContentType: `${file.map((list) => list.mimetype)[0]}`,
            });
            const fileUrl = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${uniqueKey}`;
            console.log("fileUrlfileUrl", fileUrl);
            const { name, description, price, is_featured_product, is_top_categories, our_productType_categoriesId, } = fields;
            console.log("fieldsfields", fields);
            yield productDataSource
                .createQueryBuilder()
                .insert()
                .into("product")
                .values({
                name: name[0],
                description: description[0],
                price: Number(price),
                is_featured_product: is_featured_product[0] === "true",
                is_top_categories: is_top_categories[0] === "true",
                our_productType_categoriesId: Number(our_productType_categoriesId) || null,
                image: fileUrl,
            })
                .execute();
            res.status(200).json({
                message: "Product added successfully",
                fileUrl,
            });
        }
        catch (uploadErr) {
            res
                .status(500)
                .json({ error: "Failed to upload to S3 or save product data" });
        }
    }));
});
exports.addProducts = addProducts;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { is_featured_product, is_top_categories, our_productType_categoriesId, } = req.body;
    console.log("req.queryreq.query", req.body);
    try {
        const queryBuilder = productDataSource.createQueryBuilder("product");
        if (is_featured_product && is_top_categories) {
            queryBuilder.where("product.is_featured_product = :is_featured_product AND product.is_top_categories = :is_top_categories", {
                is_featured_product: is_featured_product,
                is_top_categories: is_top_categories,
            });
        }
        else if (is_featured_product) {
            queryBuilder.where("product.is_featured_product = :is_featured_product", {
                is_featured_product: is_featured_product,
            });
        }
        else if (is_top_categories) {
            queryBuilder.where("product.is_top_categories = :is_top_categories", {
                is_top_categories: is_top_categories,
            });
        }
        else if (our_productType_categoriesId) {
            queryBuilder.where("product.our_productType_categoriesId = :our_productType_categoriesId", {
                our_productType_categoriesId: our_productType_categoriesId,
            });
        }
        const result = yield queryBuilder.getRawMany();
        res.status(200).json({ "All Products": result });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.getProducts = getProducts;
const deleteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        yield productDataSource
            .createQueryBuilder("product")
            .delete()
            .where("product.id = :id", { id })
            .execute();
        res.status(200).json("Product Deleted Successfully.");
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});
exports.deleteProducts = deleteProducts;
const updateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id } = _a, otherValues = __rest(_a, ["id"]);
    console.log("otherValues", otherValues);
    try {
        const result = yield productDataSource
            .createQueryBuilder("product")
            .update()
            .set(otherValues)
            .where("product.id = :id", { id })
            .execute();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json("");
    }
});
exports.updateProducts = updateProducts;
