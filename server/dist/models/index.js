"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
exports.Post = db_1.db.define('post', {
    id: { type: sequelize_1.DataTypes.STRING, primaryKey: true, autoIncrement: true },
    parentId: { type: sequelize_1.DataTypes.STRING },
    userName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    text: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    homePage: { type: sequelize_1.DataTypes.STRING },
    photo: { type: sequelize_1.DataTypes.STRING },
    file: { type: sequelize_1.DataTypes.STRING }
});
