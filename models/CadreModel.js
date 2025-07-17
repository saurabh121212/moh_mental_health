
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('CadreModel', {
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
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'cadres', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
