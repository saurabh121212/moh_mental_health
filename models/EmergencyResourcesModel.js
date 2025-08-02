
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('EmergencyResourcesModel', {
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
                    args: [3, 50], // min 3 chars, max 500 (optional)
                    msg: 'Name must be at least 3 characters long and at most 50 characters long'
                }
            }
        },

        services: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 100], // min 3 chars, max 500 (optional)
                    msg: 'Services must be at most 100 characters long'
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
            type: DataTypes.STRING(40),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 40], // min 3 chars, max 500 (optional)
                    msg: 'Phone number must be at most 40 characters long'
                }
            }
        },
        category_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'categories', // Name of table (not model)
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        category_name: {
            type: DataTypes.STRING(50),
            allowNull: false, // or false if required
        },
      category_url: {
            type: DataTypes.STRING(600),
            allowNull: true,
        },
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'emergency_resources', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
