import {v4} from 'uuid';

import {Post} from '../models';
import {CreatePostType, GetAllPostsType} from '../types';

class resolvers {
    async getAllPosts({offset, limit, sortField, sortIndex}: GetAllPostsType) {
        try {
            const posts = await Post.findAll({
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
            const count = await Post.count(
                sortField || sortIndex ?
                    {
                        where: {
                            parentId: '',
                        }
                    } : {}
            );
            return {posts, count};
        } catch (e) {
            return e;
        }
    }

    async createPost({input}: CreatePostType) {
        const id = v4();
        if (!input.userName || !input.email || !input.text) throw 'Required';
        if (input.homePage && !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(input.homePage)) throw 'Invalid url';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input.email)) throw 'Invalid email';
        const text = input.text as any;
        const a = text.indexOf('>') >= 0 ? text.match(/['>']/g).length : '';
        const b = text.indexOf('<') >= 0 ? text.match(/['<']/g).length : '';
        if (a || b) {
            if (!(a % 2 == 0) || !(b % 2 == 0) || a !== b) {
                throw 'Close tag';
            } else {
                input.text.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, function (match, slash, tag) {
                    if (["a", "code", "i", "strong"].indexOf(tag) < 0) {
                        throw 'Remove unresolved tags';
                    }
                    return match;
                });
            }
        }

        try {
            const post = await Post.create({id, ...input});
            return post;
        } catch (e) {
            return e;
        }
    }
}

export default new resolvers();