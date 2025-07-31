const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const EducationResourcesController = require('../controllers/educationResourcesController.js');
const authMiddleware = require('../middleware/auth.middleware');



// This is user to add Problem Focused Strategies to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name'),
    body('description'),
    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),
    body('url')    
],authMiddleware.authAdmin, EducationResourcesController.add);

// This is used to update Problem Focused Strategies in the database
router.put('/update/:id',[
    body('name'),
    body('description'),
    body('isOnlyImage')
    .isBoolean('isOnlyImage must be a boolean value'),
    body('url')   
] ,authMiddleware.authAdmin, EducationResourcesController.update);

// This is used in Mobile app to get the list of Problem Focused Strategies
router.get('/list-mobile', authMiddleware.authUser, EducationResourcesController.getMobile);

// This is used in Admin panel to get the list of Problem Focused Strategies
router.get('/list', authMiddleware.authAdmin, EducationResourcesController.get);

// This is used to delete Problem Focused Strategies from the database
router.put('/delete/:id', authMiddleware.authAdmin, EducationResourcesController.delete);


module.exports = router;
