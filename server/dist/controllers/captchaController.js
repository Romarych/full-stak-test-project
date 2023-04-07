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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_captcha_1 = __importDefault(require("svg-captcha"));
class captchaController {
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.captcha === req.body.captcha) {
                res.status(200).send({ message: 'Success!' });
            }
            else {
                res.status(400).send({ error: 'Invalid captcha' });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const captcha = svg_captcha_1.default.create();
            req.session.captcha = captcha.text;
            req.session.save();
            res.type('svg');
            res.status(200).send(captcha.data);
        });
    }
}
exports.default = new captchaController();
