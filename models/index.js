'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const CONFIG = require('../config/config.js');

let EnvName = process.env.NODE_ENV;

// If NODE_ENV is not set, default to 'development'
const sequelize = new Sequelize(CONFIG[EnvName].database, CONFIG[EnvName].username, CONFIG[EnvName].password, {
    host: CONFIG[EnvName].host,
    dialect: CONFIG[EnvName].dialect,
    port: CONFIG[EnvName].port,
    logging: CONFIG[EnvName].logging
});

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// Set up relationships
db.CategoryModel.hasMany(db.EmergencyResourcesModel, { foreignKey: 'category_id' });
db.EmergencyResourcesModel.belongsTo(db.CategoryModel, { foreignKey: 'category_id' });

db.CategoryModel.hasMany(db.SupportResourcesModel, { foreignKey: 'category_id' });
db.SupportResourcesModel.belongsTo(db.CategoryModel, { foreignKey: 'category_id' });

db.UserModel.hasMany(db.MoodModel, { foreignKey: 'user_id' });
db.MoodModel.belongsTo(db.UserModel, { foreignKey: 'user_id' });

db.UserModel.hasMany(db.SelfAssessmentTestModel, { foreignKey: 'user_id' });
db.SelfAssessmentTestModel.belongsTo(db.UserModel, { foreignKey: 'user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
