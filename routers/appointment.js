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

module.exports = router;
