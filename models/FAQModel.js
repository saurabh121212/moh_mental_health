
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('FAQModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: DataTypes.STRING('200'),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 200], // min 3 chars, max 500 (optional)
                    msg: 'Question must be at least 3 characters long and at most 500 characters long'
                }
            }
        },
        answer: {
            type: DataTypes.STRING('600'),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 600], // min 3 chars, max 500 (optional)
                    msg: 'Answer must be at least 3 characters long and at most 1200 characters long'
                }
            }
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'faqs', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
