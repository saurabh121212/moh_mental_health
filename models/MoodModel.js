
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('MoodModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        mood_name: {
            type: DataTypes.STRING(30),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 30], 
                    msg: 'Mood Name must be at least 3 characters long and at most 20 characters long'
                }
            }
        },

        mood_code: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 10], 
                    msg: 'Mood Code must be at least 1,2,3'
                }
            }
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false, // or false if required
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'moods', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
