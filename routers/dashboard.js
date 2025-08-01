const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth.middleware');


// Route to get total data for the dashboard 
router.get('/total-data/',authMiddleware.authAdmin,DashboardController.getDashboardTotalData);

// Route to get total User Graph data Region wise
router.get('/total-users-region-wise/',authMiddleware.authAdmin,DashboardController.getTotalUsersRegionWise);

// Route to get total Male Female User Graph data Region wise
router.get('/total-male-female-users-region-wise/',authMiddleware.authAdmin,DashboardController.getTotalMaleFemaleUsersRegionWise);

// Route to get total Male, Female User Graph data
router.get('/total-male-female-user-data/',authMiddleware.authAdmin,DashboardController.getDashboardTotalMaleFemaleData);

// Route to get total Users Self Assessment Test wise
router.get('/total-users-self-assessment-test-wise/',authMiddleware.authAdmin,DashboardController.getTotalUsersSelfAssessmentTestWise);

// Route to get Male Users Self Assessment Test wise
router.get('/male-users-self-assessment-test-wise/',authMiddleware.authAdmin,DashboardController.getMaleUsersSelfAssessmentTestWise);

// Route to get Female Users Self Assessment Test wise
router.get('/female-users-self-assessment-test-wise/',authMiddleware.authAdmin,DashboardController.getFemaleUsersSelfAssessmentTestWise);

// Route to get total Users Appointment Status wise
router.get('/total-users-appointment-status-wise/',authMiddleware.authAdmin,DashboardController.getTotalUsersAppointmentStatusWise);

// Route to get Feedback graph data for the dashboard
router.get('/feedback-graph-data/',authMiddleware.authAdmin,DashboardController.getFeedbackGraphData);

// send notification to All the users 
router.get('/send-notification-all-users/',authMiddleware.authAdmin,DashboardController.sendNotificationAllUsers);

module.exports = router;
