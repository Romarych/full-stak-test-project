"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("./upload"));
const captcha_1 = __importDefault(require("./captcha"));
exports.router = (0, express_1.default)();
exports.router.use('/captcha', captcha_1.default);
exports.router.use('/upload', upload_1.default);
