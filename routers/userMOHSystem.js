const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const UserMOHSystemController = require('../controllers/userMOHSystemController');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/verify-user',[
    body('national_id')
    .isLength({ min: 13, max: 13 })
    .withMessage('National Id must be between 13 digits long'),

    body('ENC_number').isLength({ min: 4, max: 6 }).
    withMessage('ENC Number must be either 4 or 6 digits long'),

],  UserMOHSystemController.verifyUser);


module.exports = router;
