module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('UserMOHSystemModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(25),
            allowNull: true, // or false if required
        },

        last_name: {
            type: DataTypes.STRING(15),
            allowNull: true, // or false if required
        },

        phone: {
            type: DataTypes.STRING(15),
            allowNull: true, // or false if required
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        national_id: {
            type: DataTypes.STRING(20),
            allowNull: true, // or false if required
        },

        ENC_number: {
            type: DataTypes.STRING(10),
            allowNull: true, // or false if required
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

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'user_moh_system', // Optional: useful for clarity and pluralization control
    });
    
    return Model;
};
