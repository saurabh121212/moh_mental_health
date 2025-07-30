
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('EducationResourcesModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 100], // min 3 chars, max 500 (optional)
                    msg: 'Name must be at least 3 characters long and at most 100 characters long'
                }
            }
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
        tableName: 'education_resources', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
