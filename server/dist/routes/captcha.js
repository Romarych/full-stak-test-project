"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const captchaController_1 = __importDefault(require("../controllers/captchaController"));
const router = (0, express_1.default)();
router.post('/', captchaController_1.default.check);
router.get('/', captchaController_1.default.get);
exports.default = router;
