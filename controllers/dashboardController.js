const BaseRepo = require('../services/BaseRepository');
const { UserModel, SelfAssessmentTestModel,AppointmentModel,FeedbackModel } = require('../models');
const { validationResult } = require('express-validator');
const sendNotification = require('../firebase/sendNotification');
const admin = require('firebase-admin');


module.exports.getDashboardTotalData = async (req, res, next) => {

  try {
    const totalRegisterUsers = await BaseRepo.baseCount(UserModel,{});
    const totalSelfAssessmentTestCompleted = await BaseRepo.baseCount(SelfAssessmentTestModel, {});
    const totalReferrals = await BaseRepo.baseCount(AppointmentModel, {});
    const totalNursesWithStress = await BaseRepo.baseCount(SelfAssessmentTestModel, {test_overall_result: 'Severe', test_overall_result: 'Mental Health Emergency'});

    console.log(totalRegisterUsers, totalSelfAssessmentTestCompleted, totalReferrals, totalNursesWithStress);

    res.status(201).json({
      message: 'Dashboard total data fetched successfully',
      data: {
        totalRegisterUsers,
        totalSelfAssessmentTestCompleted,
        totalReferrals,
        totalNursesWithStress
      }
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.getTotalUsersRegionWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const TotalUserRegionWise = await BaseRepo.baseGetDashboardTotalUserRegionWise(UserModel);

    res.status(201).json({
      message: 'Dashboard Total Users Region Wise data fetched successfully',
      data: TotalUserRegionWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports.getTotalMaleFemaleUsersRegionWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const TotalUserRegionWise = await BaseRepo.baseGetDashboardMaleFemaleUserRegionWise(UserModel);

    res.status(201).json({
      message: 'Dashboard Total Male, Female Users Region Wise data fetched successfully',
      data: TotalUserRegionWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports.getDashboardTotalMaleFemaleData = async (req, res, next) => {

  try {
    const totalRegisterUsers = await BaseRepo.baseCount(UserModel,{});
    const totalMaleUsers = await BaseRepo.baseCount(UserModel, {gender: 'Male'});
    const totalFemaleUsers = await BaseRepo.baseCount(UserModel, {gender: 'Female'});
    
    console.log(totalRegisterUsers, totalMaleUsers, totalFemaleUsers);

    res.status(201).json({
      message: 'Dashboard Graph male, female total data fetched successfully',
      data: {
        totalRegisterUsers,
        totalMaleUsers,
        totalFemaleUsers,
      }
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports.getTotalUsersSelfAssessmentTestWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const TotalUserSelfAssessmentTestWise = await BaseRepo.baseGetDashboardTotalUserSelfAssessmentTestWise(SelfAssessmentTestModel);

    res.status(201).json({
      message: 'Dashboard Total Users Self Assessment Test Wise data fetched successfully',
      data: TotalUserSelfAssessmentTestWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.getMaleUsersSelfAssessmentTestWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const MaleUserSelfAssessmentTestWise = await BaseRepo.baseGetDashboardMaleUserSelfAssessmentTestWise(SelfAssessmentTestModel,UserModel);

    res.status(201).json({
      message: 'Dashboard Male Users Self Assessment Test Wise data fetched successfully',
      data: MaleUserSelfAssessmentTestWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.getFemaleUsersSelfAssessmentTestWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const FemaleUserSelfAssessmentTestWise = await BaseRepo.baseGetDashboardFemaleUserSelfAssessmentTestWise(SelfAssessmentTestModel,UserModel);

    res.status(201).json({
      message: 'Dashboard Female Users Self Assessment Test Wise data fetched successfully',
      data: FemaleUserSelfAssessmentTestWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.getTotalUsersAppointmentStatusWise = async (req, res, next) => {

  const year = req.params.year;

  try {
    const TotalUserAppointmentStatusWise = await BaseRepo.baseGetDashboardTotalUserAppointmentStatusWise(AppointmentModel);

    res.status(201).json({
      message: 'Dashboard Total Users Appointment Status Wise data fetched successfully',
      data: TotalUserAppointmentStatusWise
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.getFeedbackGraphData = async (req, res, next) => {

  const year = req.params.year;

  try {
    const FeedbackGraphData = await BaseRepo.baseGetDashboardAverageFeedbackRatings(FeedbackModel);
    const totalFeedbacks = await BaseRepo.baseCount(FeedbackModel, {});

    res.status(201).json({
      message: 'Dashboard Feedback Graph data fetched successfully',
      data: FeedbackGraphData,
      totalFeedbacks: totalFeedbacks
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports.sendNotificationAllUsers = async (req, res, next) => {
  
  try {
    await sendNotificationToAllUsers("Provide Your Feedback", "Thank you for using Eswatini Mindcheck. Help us improve your experience by sharing your feedback.");

    res.status(201).json({
      message: 'Notification sent successfully to all users',
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


async function sendNotificationToAllUsers(name, description) {
    try {
        const users = await BaseRepo.baseFindAllToken_User(UserModel);
        const allTokens = users.map(user => user.device_token).filter(Boolean);
        console.info(`📦 Found ${allTokens.length} valid FCM tokens`);
        const tokenChunks = chunkArray(allTokens, 500); // Firebase limit

        for (let i = 0; i < tokenChunks.length; i++) {
            const tokens = tokenChunks[i];
            const message = {
                notification: {
                    title: name,
                    body: description,
                    //image: 'http://13.50.85.148:3002/healthy-lifestyle/1753807074786-mood2.png',
                },
                data: {
                    //notificationType: "mood",
                    notificationType: "feedback",
                },
                tokens,
            };

            try {
                console.info(`🚀 Sending batch ${i + 1}/${tokenChunks.length}`);
                await sendNotification(message);
            } catch (batchError) {
                console.error(`❌ Error in batch ${i + 1}:`, batchError.message);
            }
        }

        console.info('✅ All notifications sent');
    } catch (err) {
        console.error('❌ Failed to send notifications:', err.message);
    }
}


// Split an array into chunks
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}