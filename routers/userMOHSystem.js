const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const UserMOHSystemController = require('../controllers/userMOHSystemController');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/verify-user',[
    body('national_id')
    .isLength({ min: 11, max: 11 })
    .withMessage('National Id must be between 11 digits long'),

    body('ENC_number').isLength({ min: 4, max: 6 }).
    withMessage('ENC Number must be either 4 or 6 digits long'),

],  UserMOHSystemController.verifyUser);


// // This is used in Mobile app to get the list of Moods 
// router.get('/list-mobile', authMiddleware.authUser, UserMOHSystemController.getMobile);

// // This is used in Admin panel to get the list of Moods 
// router.get('/list', authMiddleware.authAdmin, UserMOHSystemController.get);




module.exports = router;
