const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const HealthyLifestyleController = require('../controllers/healthyLifestyleControllers.js');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Healthy Lifestyle Strategies to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description').notEmpty().withMessage('Description is required'),

    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),

    body('url')    
], authMiddleware.authAdmin, HealthyLifestyleController.add);

// This is used to update Healthy Lifestyle Strategies in the database
router.put('/update/:id',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description').notEmpty().withMessage('Description is required'),

    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),

    body('url')   
] , authMiddleware.authAdmin, HealthyLifestyleController.update);

// This is used in Mobile app to get the list of Healthy Lifestyle Strategies
router.get('/list-mobile', authMiddleware.authUser, HealthyLifestyleController.getMobile);

// This is used in Admin panel to get the list of Healthy Lifestyle Strategies
router.get('/list', authMiddleware.authAdmin, HealthyLifestyleController.get);

// This is used to delete Healthy Lifestyle Strategies from the database
router.put('/delete/:id', authMiddleware.authAdmin, HealthyLifestyleController.delete);


module.exports = router;
