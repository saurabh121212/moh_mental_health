const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const { fn, col, literal,where,where: sequelizeWhere } = require('sequelize');
const db = require('../models/index');


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
  baseGetMoodCountsByUser: getMoodCountsByUser 
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