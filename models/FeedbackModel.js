
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('FeedbackModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        nurse_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        nurse_name: {
            type: DataTypes.STRING(50),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Nurse Name must be between 3 and 50 characters long'
                }
            }
        },

        new_features_suggestions: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [2, 400],
                    msg: 'New Features Suggestions must be at least 2 characters long and at most 400 characters long'
                }
            }
        },

        usability_stars: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 5],
                    msg: 'Usability stars must be between 1 and 5 characters long'
                }
            }
        },

        usability_feedback: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 400],
                    msg: 'Usability feedback must be at least 3 characters long and at most 400 characters long'
                }
            }
        },

        performance_stars: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 5],
                    msg: 'Performance stars must be between 1 and 5 characters long'
                }
            }
        },
        performance_feedback: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 400],
                    msg: 'Performance feedback must be at least 3 characters long and at most 400 characters long'
                }
            }
        },

        personalization_stars: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 5],
                    msg: 'Personalization stars must be between 1 and 5 characters long'
                }
            }
        },

        personalization_feedback: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 400],
                    msg: 'Personalization feedback must be at least 3 characters long and at most 400 characters long'
                }
            }
        },

        security_stars: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 5],
                    msg: 'Security stars must be between 1 and 5 characters long'
                }
            }
        },
        security_feedback: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 400],
                    msg: 'Security feedback must be at least 3 characters long and at most 400 characters long'
                }
            }
        },


        overall_satisfaction_stars: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 5],
                    msg: 'Overall Satisfaction stars must be between 1 and 5 characters long'
                }
            }
        },
        overall_satisfaction_feedback: {
            type: DataTypes.STRING(400),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [3, 400],
                    msg: 'Overall Satisfaction feedback must be at least 3 characters long and at most 400 characters long'
                }
            }
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'feedbacks', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
