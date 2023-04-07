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
const uuid_1 = require("uuid");
const models_1 = require("../models");
class resolvers {
    getAllPosts({ offset, limit, sortField, sortIndex }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield models_1.Post.findAll({
                    order: [
                        [sortField || 'createdAt', sortIndex || 'DESC'],
                    ],
                    where: sortField || sortIndex ? {
                        parentId: '',
                    } : {},
                    limit,
                    offset: ((offset - 1) * limit),
                    subQuery: false
                });
                const count = yield models_1.Post.count(sortField || sortIndex ?
                    {
                        where: {
                            parentId: '',
                        }
                    } : {});
                return { posts, count };
            }
            catch (e) {
                return e;
            }
        });
    }
    createPost({ input }) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            if (!input.userName || !input.email || !input.text)
                throw 'Required';
            if (input.homePage && !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(input.homePage))
                throw 'Invalid url';
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input.email))
                throw 'Invalid email';
            const text = input.text;
            const a = text.indexOf('>') >= 0 ? text.match(/['>']/g).length : '';
            const b = text.indexOf('<') >= 0 ? text.match(/['<']/g).length : '';
            if (a || b) {
                if (!(a % 2 == 0) || !(b % 2 == 0) || a !== b) {
                    throw 'Close tag';
                }
                else {
                    input.text.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, function (match, slash, tag) {
                        if (["a", "code", "i", "strong"].indexOf(tag) < 0) {
                            throw 'Remove unresolved tags';
                        }
                        return match;
                    });
                }
            }
            try {
                const post = yield models_1.Post.create(Object.assign({ id }, input));
                return post;
            }
            catch (e) {
                return e;
            }
        });
    }
}
exports.default = new resolvers();
