
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
            type: DataTypes.STRING(50),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 50], // min 3 chars, max 500 (optional)
                    msg: 'Address must be at most 50 characters long'
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

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'hospitals', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
