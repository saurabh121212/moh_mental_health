const BaseRepo = require('../services/BaseRepository');
const { UserModel, SelfAssessmentTestModel,AppointmentModel } = require('../models');
const { validationResult } = require('express-validator');



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