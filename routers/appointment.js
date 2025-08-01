const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const AppointmentController = require('../controllers/appointmentControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is used to add an appointment
router.post('/add',[
    body('appointment_date').isDate().withMessage('Appointment date must be a valid date'),
    body('appointment_time').notEmpty().withMessage('Appointment time is required'),
    body('nurse_comments').optional().isLength({ max: 300 }).withMessage('Nurse comments must be at most 300 characters long'),
    body('hospital_id').notEmpty().withMessage('Hospital ID is required'),
    body('hospital_name').notEmpty().withMessage('Hospital name is required'),
    body('user_id').notEmpty().withMessage('Nurse is required'),
    body('appointment_status').isIn(['scheduled', 'confirmed', 'completed', 'cancelled']).withMessage('Appointment status must be one of the following: scheduled, confirmed, completed, cancelled'),    
], authMiddleware.authUser, AppointmentController.add);

// This is used in Mobile app to get the list of Moods 
router.get('/list-mobile/:id', authMiddleware.authUser, AppointmentController.getMobile);

// This is used in Admin panel to get the list of Moods 
router.get('/list', authMiddleware.authAdmin, AppointmentController.get);

// This is used for Completing an appointment
router.put('/completed-appointment/:id',
    body('appointment_status')
        .isIn(['completed'])
        .withMessage('Appointment status must be completed only'),
    authMiddleware.authUser, AppointmentController.acceptRejectAppointment);

    
// This is used for Canceling an appointment by the user
router.put('/cancel-appointment/:id',
    body('appointment_status')
        .isIn(['cancelled'])
        .withMessage('Appointment status must be completed only'),
    body('cancel_reason').optional().isLength({ max: 300 }).withMessage('Cancel reason must be at most 300 characters long'),
authMiddleware.authUser, AppointmentController.cancelAppointment);


// This is used for Finding the Upcoming appointments for Mobile users
router.post('/upcoming-appointments', authMiddleware.authUser, AppointmentController.upcomingAppointments);

// This is used to get the details hospital appointments with all the status codes 
router.get('/hospital-all-appointments-details/', authMiddleware.authAdmin, AppointmentController.hospitalAllAppointmentsDetails);

//hospital Appointment routes
router.get('/hospital-all-appointments/:id', authMiddleware.authAdmin, AppointmentController.hospitalAllAppointmentsList);

// This is used to check the last appointment of a user if he has more then 2 appointments or not
router.get('/last-appointment-count/:id', authMiddleware.authUser, AppointmentController.lastAppointmentCount);

module.exports = router;
