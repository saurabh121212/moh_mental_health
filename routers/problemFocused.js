const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const ProblemFocusedController = require('../controllers/problemFocusedControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Problem Focused Strategies to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description'),
   
    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),

    body('url')    
], authMiddleware.authAdmin, ProblemFocusedController.add);

// This is used to update Problem Focused Strategies in the database
router.put('/update/:id',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description'),

    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),

    body('url')   
] , authMiddleware.authAdmin, ProblemFocusedController.update);

// This is used in Mobile app to get the list of Problem Focused Strategies
router.get('/list-mobile', authMiddleware.authUser, ProblemFocusedController.getMobile);

// This is used in Admin panel to get the list of Problem Focused Strategies
router.get('/list', authMiddleware.authAdmin, ProblemFocusedController.get);

// This is used to delete Problem Focused Strategies from the database
router.put('/delete/:id', authMiddleware.authAdmin, ProblemFocusedController.delete);


module.exports = router;
