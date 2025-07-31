
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('ProblemFocusedModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
        },
        description: {
            type: DataTypes.TEXT('long'),
            allowNull: true, // or false if required
        },
        
        isOnlyImage: {
            type: DataTypes.BOOLEAN,
            allowNull: false, //
            defaultValue: false, // Default value if not provided
        },
         url: {
            type: DataTypes.STRING(600),
            allowNull: true,
        },
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'problem_focused', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
