"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const util = __importStar(require("util"));
class uploadController {
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.files.file) {
                try {
                    const file = req.files.file;
                    const fileName = file === null || file === void 0 ? void 0 : file.name;
                    const size = file === null || file === void 0 ? void 0 : file.data.length;
                    const extension = path_1.default.extname(fileName);
                    const md5 = file === null || file === void 0 ? void 0 : file.md5;
                    const URL = '/uploads/' + md5 + extension;
                    const allowedExtensionsDocument = /txt/;
                    const allowedExtensionsImage = /png|jpeg|jpg|gif/;
                    if (!allowedExtensionsDocument.test(extension) && !allowedExtensionsImage.test(extension))
                        res.status(400).send({ error: 'Unsupported extension' });
                    if (allowedExtensionsDocument.test(extension)) {
                        if (size > 100000)
                            throw 'File must be less than 100KB';
                        yield util.promisify(file.mv)('./public' + URL);
                        res.json(URL);
                    }
                    if (allowedExtensionsImage.test(extension)) {
                        (0, sharp_1.default)(file.data)
                            .resize(320, 240)
                            .toFile('public' + URL, (err, info) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                        res.json(URL);
                    }
                }
                catch (error) {
                    console.log(error);
                    res.status(500).json({
                        message: error
                    });
                }
            }
            else {
                res.status(200);
            }
        });
    }
}
;
exports.default = new uploadController();
