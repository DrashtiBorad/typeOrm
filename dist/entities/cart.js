"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCart = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const products_1 = require("./products");
let ProductCart = class ProductCart {
};
exports.ProductCart = ProductCart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", Number)
], ProductCart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductCart.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_1.User, (user) => user.id),
    (0, typeorm_1.JoinColumn)({ name: "userid" }),
    __metadata("design:type", user_1.User)
], ProductCart.prototype, "userid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => products_1.Product, (product) => product.id),
    (0, typeorm_1.JoinColumn)({ name: "productid" }),
    __metadata("design:type", products_1.Product)
], ProductCart.prototype, "productid", void 0);
exports.ProductCart = ProductCart = __decorate([
    (0, typeorm_1.Entity)()
], ProductCart);
