"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
exports.schema = (0, graphql_1.buildSchema)(`
    scalar Date
    type Posts {
        posts: [Post]
        count: Int
    }
    type Post {
        id: String
        parentId: String
        userName: String
        email: String
        homePage: String
        text: String
        photo: String
        file: String
        createdAt: Date
    }
    input PostsInput {
         posts: [PostInput]
    }
    input PostInput {
        id: String
        parentId: String
        userName: String!
        email: String
        homePage: String
        text: String!
        photo: String
        file: String
    }
    type Mutation {
        createPost(input: PostInput): Post
    }
    type Query {
        getAllPosts(offset: Int limit: Int sortField: String, sortIndex: String): Posts   
    }
`);
