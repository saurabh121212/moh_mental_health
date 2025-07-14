const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('UserModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(25),
            allowNull: false, // or false if required
        },

        first_name_iv: DataTypes.STRING,        // If you're using a shared IV
        first_name_auth_tag: DataTypes.STRING,  // Same here


        last_name: {
            type: DataTypes.STRING(15),
            allowNull: true, // or false if required
        },
        
        last_name_iv: DataTypes.STRING,        
        last_name_auth_tag: DataTypes.STRING,

        phone: {
            type: DataTypes.STRING(15),
            allowNull: true, // or false if required
        },

        phone_iv: DataTypes.STRING,        
        phone_auth_tag: DataTypes.STRING,

        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        email_iv: DataTypes.STRING,        
        email_auth_tag: DataTypes.STRING,

        national_id: {
            type: DataTypes.STRING(20),
            allowNull: true, // or false if required
        },
        national_id_iv: DataTypes.STRING,        
        national_id_auth_tag: DataTypes.STRING,

        ENC_number: {
            type: DataTypes.STRING(10),
            allowNull: true, // or false if required
        },

        ENC_number_iv: DataTypes.STRING,        
        ENC_number_auth_tag: DataTypes.STRING,


        email_login_key: {
            type: DataTypes.STRING,
            unique: true
        },

        alias_name: {
            type: DataTypes.STRING(20),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [3, 20],
                    msg: 'Alice Name must be between 3 and 20 characters long'
                }
            }
        },
        system_generated_name: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'System Generated Name must be between 3 and 100 characters long'
                }
            }
        },


        gender: {
            type: DataTypes.STRING(20),
            allowNull: true, // or false if required
            minlength: [3, 'Gender Name Must be at least 3 characters long'],
        },

        region: {
            type: DataTypes.STRING(50),
            allowNull: true, // or false if required
        },

        address: {
            type: DataTypes.STRING(150),
            allowNull: true, // or false if require
        },

        clinic: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Clinic name must be between 3 and 100 characters long'
                }
            }
        },

        cadre: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Cadre name must be between 3 and 100 characters long'
                }
            }
        },

        password: {
            type: DataTypes.STRING(400),
            allowNull: true, // or false if required
        },

        jwt_token: {
            type: DataTypes.STRING(300),
            allowNull: true // or false if required
        },

        device_id: {
            type: DataTypes.STRING(100),
            allowNull: false // or false if required
        },
        device_type: {
            type: DataTypes.STRING(50),
            allowNull: false // or false if required
        },
        device_token: {
            type: DataTypes.STRING(400),
            allowNull: false // or false if required
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'users', // Optional: useful for clarity and pluralization control
    });


    Model.prototype.generateAuthToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: '300h' });
    };


    Model.prototype.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
    };

    Model.hashPassword = async function (password) {
        return await bcrypt.hash(password, 10);
    };


    return Model;
};
