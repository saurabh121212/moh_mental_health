const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('AdminModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true // or false if required
        },
        token: {
            type: DataTypes.STRING(100),
            allowNull: true // or false if required
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: true, // or false if required
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            lowercase: true,
            trim: true,
            },
        user_type: {
            type: DataTypes.STRING(20),
            allowNull: true,
            enum: ['admin', 'user'],
            default: 'admin',
        },
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'admins', // Optional: useful for clarity and pluralization control
    });


     Model.prototype.generateAuthToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '24h' });
    };


    Model.prototype.comparePassword = async function (password) {
        return  bcrypt.compare(password, this.password);
    };

    Model.hashPassword = async function (password) {
        return await bcrypt.hash(password, 10);
    };


    return Model;
};
