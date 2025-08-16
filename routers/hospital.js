const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const HospitalController = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Hospital to the database
// It validates the input data and then calls the controller to add the data
router.post('/add', [
    body('name')
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters long'),

    body('services')
        .isLength({ min: 0, max: 200 })
        .withMessage('services max 200 characters long'),

    body('address')
        .isLength({ min: 0, max: 80 })
        .withMessage('services max 80 characters long'),
    body('city').optional()
        .isLength({ min: 0, max: 80 })
        .withMessage('City max 80 characters long'),
    body('region').optional()
        .isLength({ min: 0, max: 80 })
        .withMessage('Region max 80 characters long'),

    body('phone_number')
        .isLength({ min: 0, max: 20 })
        .withMessage('Phone number max 20 characters long'),

    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),

    body('operating_days')
        .isLength({ min: 0, max: 150 })
        .withMessage('Operating days max 150 characters long'),

    body('operating_hours')
        .isLength({ min: 0, max: 150 })
        .withMessage('Operating hours max 150 characters long'),


], authMiddleware.authAdmin, HospitalController.add);

// This is used to update Hospital in the database
router.put('/update/:id', [
    body('name')
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters long'),

    body('services')
        .isLength({ min: 0, max: 200 })
        .withMessage('services max 100 characters long'),

    body('address')
        .isLength({ min: 0, max: 80 })
        .withMessage('services max 80 characters long'),
    body('city').optional()
        .isLength({ min: 0, max: 80 })
        .withMessage('City max 80 characters long'),
        
    body('region').optional()
        .isLength({ min: 0, max: 80 })
        .withMessage('Region max 80 characters long'),

    body('phone_number')
        .isLength({ min: 0, max: 20 })
        .withMessage('Phone number max 20 characters long'),

    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),

    body('operating_days')
        .isLength({ min: 0, max: 150 })
        .withMessage('Operating days max 150 characters long'),

    body('operating_hours')
        .isLength({ min: 0, max: 150 })
        .withMessage('Operating hours max 150 characters long'),

], authMiddleware.authAdmin, HospitalController.update);

// This is used in Mobile app to get the list of Hospital
router.get('/list-mobile', authMiddleware.authUser, HospitalController.getMobile);

// This is used in Admin panel to get the list of Hospital
router.get('/list', authMiddleware.authAdmin, HospitalController.get);

// This is used to delete Hospital from the database
router.put('/delete/:id', authMiddleware.authAdmin, HospitalController.delete);

// This is used for Hospital login
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password'),
], HospitalController.loginHospital);


//hospital Appointment routes
router.get('/hospital-all-appointments/:id', authMiddleware.authHospital, HospitalController.hospitalAllAppointments);

// This is used to get the details of a specific User
router.get('/get-user-details/:id', authMiddleware.authHospital, HospitalController.getUserDetails);

// This is used to get the details of a Assessment Test
router.get('/get-assessment-test-details/:id', authMiddleware.authHospital, HospitalController.getAssessmentTestDetails);

// This is used for accepting, rejecting an appointment
router.put('/accept-reject-appointment/:id',
    body('appointment_status')
        .isIn(['confirmed', 'cancelled'])
        .withMessage('Appointment status must be one of the following: confirmed, cancelled'),
    authMiddleware.authHospital, HospitalController.acceptRejectAppointment);


// This is used to Complete an appointment
router.put('/completed-appointment-hospital/:id',
    body('appointment_status')
        .isIn(['completed'])
        .withMessage('Appointment status must be completed only'),
    authMiddleware.authHospital, HospitalController.acceptRejectAppointment);    
    

// This is used when a hospital reject an appointment and add comments
router.put('/reject-appointment-comments/:id',
    body('hospital_comments').optional().isLength({ max: 300 }).withMessage('Hospital comments must be at most 300 characters long'),
    authMiddleware.authHospital, HospitalController.rejectAppointment);


//hospital All Confirmed Appointment routes
router.get('/hospital-all-confirmed-appointments/:id', authMiddleware.authHospital, HospitalController.hospitalAllConfirmedAppointments);

//hospital All Rejected Appointment routes
router.get('/hospital-all-rejected-appointments/:id', authMiddleware.authHospital, HospitalController.hospitalAllRejectedAppointments);


// This is used to get the hospital all upcoming appointments
router.get('/hospital-all-upcoming-appointments/:id', authMiddleware.authHospital, HospitalController.hospitalAllUpcomingAppointments);

// This is used to get the hospital all past appointments
router.get('/hospital-all-past-appointments/:id', authMiddleware.authHospital, HospitalController.hospitalAllPastAppointments);

// This is used to get the details of a Assessment Test
router.get('/get-assessment-test-single-detail/:id', authMiddleware.authHospital, HospitalController.getAssessmentTestDetailsSingle);

// This is same as the above one but this is used in Admin panel
router.get('/get-assessment-test-single-detail-v2/:id', authMiddleware.authAdmin, HospitalController.getAssessmentTestDetailsSingle);


// This API is used to send an OTP to the user's email address for password reset
router.put('/forget-password-send-otp/:email',[], HospitalController.forgetPasswordSendEmail);

// This API is used to verify the OTP sent to the user's email address for password reset
router.put('/forget-password-otp-verify/:email/:otp',[], HospitalController.forgetPasswordVerifyOTP);

// This API is used to reset the user's password after verifying the OTP
router.put('/forget-password/:email/:password',[], HospitalController.forgetPassword);


// This API is used for the hospital graphs data
router.get('/hospital-graph-data/:id', authMiddleware.authHospital, HospitalController.hospitalGraphsData);

module.exports = router;
