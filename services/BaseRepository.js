const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const { fn, col, literal, where, where: sequelizeWhere } = require('sequelize');
const db = require('../models/index');
const moment = require('moment');


module.exports = {
  baseCreate: create,
  baseBulkCreate: bulkCreate,
  baseDetail: detail,
  baseList: list,
  baseUpdate: update,
  baseDelete: deleteEntry,
  baseRestore: baseRestore,
  baseCount: count,
  baseFindById: findById,
  baseFindById2Keys: findById2Keys,
  baseFindAllById: findAllById,
  baseGalleryList: GalleryList,
  baseGetDashboardTotalUserRegionWise: getDashboardTotalUserRegionWise,
  baseGetDashboardMaleFemaleUserRegionWise: getDashboardMaleFemaleUserRegionWise,
  baseGetDashboardTotalUserSelfAssessmentTestWise: getDashboardTotalUserSelfAssessmentTestWise,
  baseGetDashboardMaleUserSelfAssessmentTestWise: getDashboardMaleUserSelfAssessmentTestWise,
  baseGetDashboardFemaleUserSelfAssessmentTestWise: getDashboardFemaleUserSelfAssessmentTestWise,
  baseGetDashboardTotalUserAppointmentStatusWise: getDashboardTotalUserAppointmentStatusWise,
  baseGetMoodCountsByUser: getMoodCountsByUser,
  baseGetUpcomingAppointmentsFromUserDateTime: getUpcomingAppointmentsFromUserDateTime,
  baseGetHospitalAppointmentsFullDetails: getHospitalAppointmentsFullDetails,
  baseGetDashboardAverageFeedbackRatings: getDashboardAverageFeedbackRatings,
  baseGetAppointmentsCountByUserId: getAppointmentsCountByUserId,
  baseGetConflictingAppointments: getConflictingAppointments,
  baseGetConflictingAppointmentsScheduled: getConflictingAppointmentsScheduled,
  baseFindAllToken_User: findAllToken_User,
};

function create(modal, data) {
  return modal.create(data);
}

function bulkCreate(modal, data) {
  return modal.bulkCreate(data, { returning: true });
}

function count(modal, searchParams) {
  return modal.count({ where: searchParams });
}

// function count(modal, searchParams) {
//   return modal.count({ 
//     where: searchParams 

//   });
// }



function findById(modal, params, key) {
  return modal.findOne({
    where: {
      [key]: params
    }
  });
}


function findById2Keys(modal, params1, params2, key1, key2) {
  return modal.findOne({
    where: {
      [key1]: params1,
      [key2]: params2
    }
  });
}



function findAllById(modal, params, key) {
  return modal.findAll({
    where: {
      [key]: params
    }
  });
}


function detail(modal, params) {
  const query = {
    where: params.searchParams
  };
  if (params.hasOwnProperty('attributes')) {
    query['attributes'] = params.attributes;
  }
  if (params.hasOwnProperty('include')) {
    query['include'] = params.include;
  }
  if (params.hasOwnProperty('paranoid')) {
    query['paranoid'] = params.paranoid;
  }
  if (params.hasOwnProperty('order')) {
    query['order'] = params.order;
  }

  return modal.findOne(query);
}


function GalleryList(modal, params) {
  const query = {
    where: params.searchParams
  };
  if (params.hasOwnProperty('attributes')) {
    query['attributes'] = params.attributes;
  }
  if (params.hasOwnProperty('order')) {
    query['order'] = params.order;
  }
  if (params.hasOwnProperty('distinct')) {
    query['distinct'] = params.distinct;
  }
  if (params.hasOwnProperty('group')) {
    query['group'] = params.group;
  }
  return modal.findAll(query);
}


async function list(modal, params) {
  let withPagination = false;

  const query = {
    where: params.searchParams || params.where || {}
  }

  if (params.hasOwnProperty('attributes')) {
    query['attributes'] = params.attributes;
  }
  if (params.hasOwnProperty('include')) {
    query['include'] = params.include;
    // distinct is true because paginator count include as row
    query['distinct'] = true;
  }
  if (params.hasOwnProperty('order')) {
    query['order'] = params.order;
  }
  if (params.hasOwnProperty('limit')) {
    query['limit'] = params.limit;
    withPagination = true;
  }
  if (params.hasOwnProperty('paranoid')) {
    query['paranoid'] = params.paranoid;
  }
  if (params.hasOwnProperty('offset')) {
    query['offset'] = params.offset;
  }
  if (params.hasOwnProperty('isRaw')) {
    query['raw'] = params.isRaw;
  }
  if (params.hasOwnProperty('distinct')) {
    query['distinct'] = params.distinct;
  }
  if (params.hasOwnProperty('group')) {
    query['group'] = params.group;
  }
  if (params.hasOwnProperty('having')) {
    query['having'] = params.having;
  }

  if (withPagination) {

    const data = await modal.findAndCountAll(query);
    const total = data.count;
    const totalPages = Math.ceil(total / params.limit);

    return {
      values: data,
      page: params.page,
      limit: params.limit,
      total_pages: totalPages,
      total: total
    }
  }
}





function update(modal, params, data) {
  let queryParams = {};
  if (params.hasOwnProperty('searchParams')) {
    queryParams = { where: params.searchParams };
  } else {
    queryParams = { where: params };
  }
  if (params.hasOwnProperty('limit')) {
    queryParams['limit'] = params.limit;
  }
  if (params.hasOwnProperty('paranoid')) {
    queryParams['paranoid'] = params.paranoid;
  }
  console.log("params ==> ", queryParams);
  return modal.update(data, queryParams);
}



function deleteEntry(modal, searchParams) {
  return modal.destroy({ where: searchParams });
}

function baseRestore(modal, searchParams) {
  return modal.restore({ where: searchParams });
}



async function getDashboardTotalUserRegionWise(modal) {
  try {
    const usersByRegion = await modal.findAll({
      attributes: [
        'region',
        [fn('COUNT', col('*')), 'user_count']
      ],
      group: ['region'],
      order: [[fn('COUNT', col('*')), 'DESC']] // optional: sort by count
    });

    return usersByRegion

  } catch (error) {
    console.error('Error fetching Users by Regions data:', error);
    throw error;
  }
}



async function getDashboardMaleFemaleUserRegionWise(modal) {
  try {
    const usersByRegionAndGender = await modal.findAll({
      attributes: [
        'region',
        'gender',
        [fn('COUNT', col('*')), 'user_count']
      ],
      group: ['region', 'gender'],
      order: [['region', 'ASC'], ['gender', 'ASC']]
    });

    return usersByRegionAndGender;

  } catch (error) {
    console.error('Error fetching Users by Region and Gender:', error);
    throw error;
  }
}


async function getDashboardTotalUserSelfAssessmentTestWise(modal) {
  try {
    const usersBySelfAssessment = await modal.findAll({
      attributes: [
        'test_overall_result',
        [fn('COUNT', col('*')), 'user_count']
      ],
      group: ['test_overall_result'],
      order: [[fn('COUNT', col('*')), 'DESC']] // optional: sort by count
    });

    return usersBySelfAssessment

  } catch (error) {
    console.error('Error fetching Users by Regions data:', error);
    throw error;
  }
}



async function getDashboardMaleUserSelfAssessmentTestWise(SelfAssessment, User) {
  try {
    const usersBySelfAssessment = await SelfAssessment.findAll({
      attributes: [
        'test_overall_result',
        [fn('COUNT', col('*')), 'user_count']
      ],
      include: [{
        model: User,
        attributes: [], // We only need it for filtering
        where: { gender: 'Male' }
      }],
      group: ['test_overall_result'],
      order: [[fn('COUNT', col('*')), 'DESC']]
    });

    return usersBySelfAssessment;

  } catch (error) {
    console.error('Error fetching self-assessment data by gender:', error);
    throw error;
  }
}



async function getDashboardFemaleUserSelfAssessmentTestWise(SelfAssessment, User) {
  try {
    const usersBySelfAssessment = await SelfAssessment.findAll({
      attributes: [
        'test_overall_result',
        [fn('COUNT', col('*')), 'user_count']
      ],
      include: [{
        model: User,
        attributes: [], // We only need it for filtering
        where: { gender: 'Female' }
      }],
      group: ['test_overall_result'],
      order: [[fn('COUNT', col('*')), 'DESC']]
    });

    return usersBySelfAssessment;

  } catch (error) {
    console.error('Error fetching self-assessment data by gender:', error);
    throw error;
  }
}



async function getDashboardTotalUserAppointmentStatusWise(modal) {
  try {
    const usersByAppointment = await modal.findAll({
      attributes: [
        'appointment_status',
        [fn('COUNT', col('*')), 'user_count']
      ],
      group: ['appointment_status'],
      order: [[fn('COUNT', col('*')), 'DESC']] // optional: sort by count
    });

    return usersByAppointment

  } catch (error) {
    console.error('Error fetching Users by Appointments data:', error);
    throw error;
  }
}


async function getDashboardAverageFeedbackRatings(modal) {
  try {
    const averageRatings = await modal.findAll({
      attributes: [
        [fn('AVG', col('usability_stars')), 'avg_usability'],
        [fn('AVG', col('performance_stars')), 'avg_performance'],
        [fn('AVG', col('personalization_stars')), 'avg_personalization'],
        [fn('AVG', col('security_stars')), 'avg_security'],
        [fn('AVG', col('overall_satisfaction_stars')), 'avg_overall_satisfaction'],
      ],
      raw: true
    });

    return averageRatings;

  } catch (error) {
    console.error('Error fetching Users by Appointments data:', error);
    throw error;
  }
}


async function getMoodCountsByUser(Model, userId) {
  const moodCounts = await Model.findAll({
    where: { user_id: userId },
    attributes: [
      'mood_code',
      [Sequelize.fn('COUNT', Sequelize.col('mood_code')), 'count']
    ],
    group: ['mood_code']
  });

  // Convert results to a cleaner object
  const result = {
    happy: 0,
    neutral: 0,
    sad: 0
  };

  moodCounts.forEach(item => {
    const code = item.getDataValue('mood_code');
    const count = parseInt(item.getDataValue('count'));

    if (code === '1') result.happy = count;
    else if (code === '2') result.neutral = count;
    else if (code === '3') result.sad = count;
  });

  return result;
};


async function getUpcomingAppointmentsFromUserDateTime(Model, userId, userDateStr, userTimeStr) {
  // Convert user input to usable formats
  const userDate = moment(userDateStr, 'DD-MM-YYYY');
  const userTime = moment(userTimeStr, 'HH:mm'); // 24-hour format like 16:00

  const appointments = await Model.findAll({
    where: {
      user_id: userId,
      appointment_date: {
        [Op.gte]: userDate.startOf('day').toDate()
      },
      appointment_status: {
        [Op.in]: ['confirmed',] // Include all relevant statuses
      }
    },
    order: [['appointment_date', 'ASC'], ['createdAt', 'ASC']]
  });

  // Filter logic
  const filteredAppointments = appointments.filter(app => {
    const appointmentDate = moment(app.appointment_date).startOf('day');
    const [startTimeStr] = app.appointment_time.split(' to ');
    const appointmentTime = moment(startTimeStr, 'hh:mm A'); // e.g., "03:00 PM"

    if (appointmentDate.isAfter(userDate)) {
      return true;
    } else if (appointmentDate.isSame(userDate, 'day')) {
      return appointmentTime.isAfter(userTime);
    }
    return false;
  });

  return filteredAppointments;
};


async function getHospitalAppointmentsFullDetails(HospitalModel, AppointmentModel) {
  const hospitals = await HospitalModel.findAll({
    attributes: [
      'id',
      'name',
      [fn('COUNT', col('AppointmentModels.id')), 'totalAppointments'],
      [
        fn('SUM', literal(`CASE WHEN AppointmentModels.appointment_status = 'scheduled' THEN 1 ELSE 0 END`)),
        'scheduledCount'
      ],
      [
        fn('SUM', literal(`CASE WHEN AppointmentModels.appointment_status = 'confirmed' THEN 1 ELSE 0 END`)),
        'confirmedCount'
      ],
      [
        fn('SUM', literal(`CASE WHEN AppointmentModels.appointment_status = 'completed' THEN 1 ELSE 0 END`)),
        'completedCount'
      ],
      [
        fn('SUM', literal(`CASE WHEN AppointmentModels.appointment_status = 'cancelled' THEN 1 ELSE 0 END`)),
        'cancelledCount'
      ]
    ],
    include: [
      {
        model: AppointmentModel,
        // alias used by Sequelize by default
        // you can inspect this by checking your association definitions
        as: 'AppointmentModels',
        attributes: [],
        required: false
      }
    ],
    group: ['HospitalModel.id'],
    raw: true
  });
  return hospitals;
}


async function getAppointmentsCountByUserId(AppointmentModel, userId) {
  const totalAppointments = await AppointmentModel.count({
    where: {
      user_id: userId,
      appointment_status: {
        [Op.in]: ['scheduled', 'confirmed'],
      },
    },
  });
  return totalAppointments;
}


async function getConflictingAppointments(AppointmentModel,minDate, maxDate, userId) {
  const conflictCount = await AppointmentModel.count({
    where: {
      user_id: userId,
      appointment_status: 'confirmed',
      appointment_date: {
        [Op.between]: [minDate, maxDate],
      },
    },
  });
  return conflictCount;
}



async function getConflictingAppointmentsScheduled(AppointmentModel,minDate, maxDate, userId) {
  const conflictCount = await AppointmentModel.findOne({
    where: {
      user_id: userId,
      appointment_status: 'scheduled',
      appointment_date: {
        [Op.between]: [minDate, maxDate],
      },
    },
  });
  return conflictCount;
}



function findAllToken_User(modal) {
  return modal.findAll({
    attributes: ['device_token'],
    where: {
      device_token: {
        [Sequelize.Op.ne]: null,
      },
    },
  });
}
