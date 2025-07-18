
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('AppointmentModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        appointment_date: {
            type: DataTypes.DATE,
            allowNull: false, // or false if required
            validate: {
                isDate: {
                    msg: 'Appointment date must be a valid date'
                }
            }
        },

        appointment_time: {
            type: DataTypes.STRING(50),
            allowNull: false, // or false if required   
        },

        nurse_comments: {
            type: DataTypes.STRING(300),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 300], 
                    msg: 'Nurse comments must be at most 300 characters long'
                }   
            }
        },

        hospital_id: {
            type: DataTypes.BIGINT,
            allowNull: false, // or false if required
            references: {
                model: 'hospitals',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },

        hospital_name: {
            type: DataTypes.STRING(100),
            allowNull: false, // or false if required
        },

        hospital_comments: {
            type: DataTypes.STRING(300),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [0, 300], 
                    msg: 'Hospital comments must be at most 300 characters long'
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

        appointment_status: {
            type: DataTypes.STRING(50),
            allowNull: false, // or false if required
            validate: {
                isIn: {
                    args: [['scheduled', 'confirmed', 'completed', 'cancelled']],
                    msg: 'Appointment status must be one of the following: scheduled, confirmed, completed, cancelled'
                }
            }
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'appointments', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
