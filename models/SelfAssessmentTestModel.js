
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('SelfAssessmentTestModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        overwhelmed: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        trouble_sleeping: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        experiencing_physical_symptoms: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        frequent_exhaustion: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        lost_motivation: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        quitting_your_job: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        lost_interest: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        section_1_score: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
        },

        stress_recognition_ability: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        stress_management_ability: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        getting_enough_rest: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        physically_active: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        annual_check_ups: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        supported_at_work: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        workload_manageable: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        support_system: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        respected_in_relationships: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        healthy_coping_strategies: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        spiritual_belief: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        seek_heap_when_in_need: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        growing_personally_professionally: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        work_life_balance: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },


        sense_purpose_daily: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        section_2_score: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
        },

        terminal_chronic_illness: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        traumatic_event: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        personal_harm_or_others: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        sadness_and_hopelessness: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        alcohol_use: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        substance_use: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        unhealthy_eating_habits: {
            type: DataTypes.STRING(20),
            allowNull: false, // or false if required
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Answer Must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes'
                }
            }
        },

        section_3_score: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required
        },

        test_score: {
            type: DataTypes.STRING(10),
            allowNull: false, // or false if required

        },

        test_overall_result: {
            type: DataTypes.STRING(40),
            allowNull: false, // or false if required      
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

        
         system_generated_name: {
            type: DataTypes.STRING(100),
            allowNull: true, // or false if required
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'System Generated Name must be between 3 and 100 characters long'
                }
            }
        },

    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'self_assessment_tests', // Optional: useful for clarity and pluralization control
    });

    return Model;
};
