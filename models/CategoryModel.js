
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('CategoryModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 20], // min 3 chars, max 500 (optional)
                    msg: 'Name must be at least 3 characters long and at most 20 characters long'
                }
            }
        },
         url: {
            type: DataTypes.STRING(600),
            allowNull: true,
        },
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'categories', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
