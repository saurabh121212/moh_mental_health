const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('HospitalModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 100], // min 3 chars, max 500 (optional)
                    msg: 'Name must be at least 3 characters long and at most 50 characters long'
                }
            }
        },

        services: {
            type: DataTypes.STRING(200),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 200], // min 3 chars, max 500 (optional)
                    msg: 'Services must be at most 200 characters long'
                }
            }
        },

        address: {
            type: DataTypes.STRING(80),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 80], // min 3 chars, max 500 (optional)
                    msg: 'Address must be at most 80 characters long'
                }
            }
        },

        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 20], // min 3 chars, max 500 (optional)
                    msg: 'Phone number must be at most 8 characters long'
                }
            }
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                isEmail: {
                    msg: 'Email must be a valid email address'
                }
            }
        },
         operating_days: {
            type: DataTypes.STRING(150),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 150], // min 3 chars, max 500 (optional)
                    msg: 'Operating days must be at most 150 characters long'
                }
            }
        },

        operating_hours : {
            type: DataTypes.STRING(150),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 150], // min 3 chars, max 500 (optional)
                    msg: 'Operating hours must be at most 150 characters long'
                }
            }
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true, // or false if required
        },
        lng: {
            type: DataTypes.FLOAT,
            allowNull: true, // or false if required
        },
        token: {
            type: DataTypes.STRING(100),
            allowNull: true // or false if required
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false, // or false if required
        },
        
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'hospitals', // Optional: useful for clarity and pluralization control
        });

         Model.prototype.generateAuthToken = function () {
            return jwt.sign({ id: this.id }, process.env.JWT_SECRET_HOSPITAL, { expiresIn: '24h' });
        };
    
        Model.prototype.comparePassword = async function (password) {
            return  bcrypt.compare(password, this.password);
        };
    
        Model.hashPassword = async function (password) {
            return await bcrypt.hash(password, 10);
        };

    return Model;
};
