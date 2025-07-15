const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/userControllers');

// This is used to register a new Mobile user
router.post('/register',[
    body('first_name').isLength({ min: 3, max: 25 }).withMessage('First Name must be between 3 and 25 characters long'),
    body('last_name').isLength({ min: 3, max: 15 }).withMessage('Last Name must be between 3 and 15 characters long'),
    body('phone').isLength({ min: 3, max: 15 }).withMessage('Phone Number must be between 3 and 15 characters long'),
    body('email').isEmail().withMessage('Invalid Email Format').isLength({ min: 3, max: 100 }).withMessage('Email Id must be between 3 and 100 characters long'),
    body('national_id').isLength({ min: 3, max: 20 }).withMessage('National Id must be between 3 and 20 characters long'),
    body('ENC_number').isLength({ min: 3, max: 10 }).withMessage('ENC Number must be between 3 and 10 characters long'),
    body('gender').isLength({ min: 3, max: 20 }).withMessage('Gender must be between 3 and 20 characters long'),
    body('region').isLength({ min: 3, max: 50 }).withMessage('Region must be between 3 and 50 characters long'),
    body('address').isLength({ min: 3, max: 150 }).withMessage('Address must be between 3 and 150 characters long'),
    body('clinic').isLength({ min: 3, max: 100 }).withMessage('Clinic must be between 3 and 100 characters long'),
    body('cadre').isLength({ min: 3, max: 100 }).withMessage('Cadre must be between 3 and 100 characters long'),
    body('password').isLength({ min: 3, max: 100 }).withMessage('Password must be between 6 and 100 characters long'),
    body('device_id').isLength({ min: 3, max: 100 }).withMessage('Device Id must be between 3 and 100 characters long'),
    body('device_type').isLength({ min: 3, max: 50 }).withMessage('Device Type must be between 3 and 50 characters long'),
    body('device_token').isLength({ min: 3, max: 400 }).withMessage('Device Token must be between 3 and 400 characters long'),
], userController.registerUser);

// This is used to login a user
// It will return a JWT token if the user is authenticated successfully
router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password'),
    body('device_id').notEmpty().withMessage('device id is required'),
    body('device_type').notEmpty().withMessage('device type is required'),
    body('device_token').notEmpty().withMessage('device token is required'),
], userController.loginUser);


// This is used to send OTP for forget password
router.post('/send_otp_forget_password', userController.sendOTPForgetPassword);

// This is used to verify OTP for forget password
router.put('/forget_password/:email',[
    body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters long'),
],userController.forgetPassword);


// This is used to update FAQs in the database
router.put('/update/:id',[
    body('first_name').isLength({ min: 3, max: 25 }).withMessage('First Name must be between 3 and 25 characters long'),
    body('last_name').isLength({ min: 3, max: 15 }).withMessage('Last Name must be between 3 and 15 characters long'),
    body('phone').isLength({ min: 3, max: 15 }).withMessage('Phone Number must be between 3 and 15 characters long'),
    body('email').isLength({ min: 3, max: 100 }).withMessage('Email Id must be between 3 and 100 characters long'),
    body('national_id').isLength({ min: 3, max: 20 }).withMessage('National Id must be between 3 and 20 characters long'),
    body('ENC_number').isLength({ min: 3, max: 10 }).withMessage('ENC Number must be between 3 and 10 characters long'),
    body('alias_name').isLength({ min: 3, max: 20 }).withMessage('Alias Name must be between 3 and 20 characters long'),
    body('gender').isLength({ min: 3, max: 20 }).withMessage('Gender must be between 3 and 20 characters long'),
    body('region').isLength({ min: 3, max: 50 }).withMessage('Region must be between 3 and 50 characters long'),
    body('address').isLength({ min: 3, max: 150 }).withMessage('Address must be between 3 and 150 characters long'),
    body('clinic').isLength({ min: 3, max: 100 }).withMessage('Clinic must be between 3 and 100 characters long'),
    body('cadre').isLength({ min: 3, max: 100 }).withMessage('Cadre must be between 3 and 100 characters long'),
    body('password').isLength({ min: 3, max: 100 }).withMessage('Password must be between 6 and 100 characters long'),
    body('jwt_token').isLength({ min: 3, max: 300 }).withMessage('JWT Token must be between 3 and 300 characters long'),
    body('device_id').isLength({ min: 3, max: 100 }).withMessage('Device Id must be between 3 and 100 characters long'),
    body('device_type').isLength({ min: 3, max: 50 }).withMessage('Device Type must be between 3 and 50 characters long'),
    body('device_token').isLength({ min: 3, max: 400 }).withMessage('Device Token must be between 3 and 400 characters long'),
] , userController.update);

// This is used in Mobile app to get the list of FAQs
router.get('/list-mobile', userController.getMobile);

// This is used in Admin panel to get the list of FAQs
router.get('/list', userController.get);

// This is used to delete FAQs from the database
router.put('/delete/:id', userController.delete);

module.exports = router;
