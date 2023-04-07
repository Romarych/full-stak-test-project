import {DataTypes} from 'sequelize';

import {db} from '../db';

export const Post = db.define('post', {
    id: {type: DataTypes.STRING, primaryKey: true, autoIncrement: true},
    parentId: {type: DataTypes.STRING},
    userName: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false},
    homePage: {type: DataTypes.STRING},
    photo: {type: DataTypes.STRING},
    file: {type: DataTypes.STRING}
});