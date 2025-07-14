const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const MindfulnessVideosController = require('../controllers/mindfulnessVideosControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Mindfulness Videos to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description')
    .isLength({ min: 0, max: 1000 })
    .withMessage('description max 1000 characters long'),

    body('uploaded_date'),

    body('url')    
], authMiddleware.authAdmin, MindfulnessVideosController.add);

// This is used to update Mindfulness Videos in the database
router.put('/update/:id',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

    body('description')
    .isLength({ min: 0, max: 1000 })
    .withMessage('description max 1000 characters long'),

    body('uploaded_date'),

    body('url') 
] , authMiddleware.authAdmin, MindfulnessVideosController.update);

// This is used in Mobile app to get the list of Mindfulness Videos
router.get('/list-mobile', authMiddleware.authUser, MindfulnessVideosController.getMobile);

// This is used in Admin panel to get the list of Mindfulness Videos
router.get('/list',authMiddleware.authAdmin, MindfulnessVideosController.get);

// This is used to delete Mindfulness Videos from the database
router.put('/delete/:id', authMiddleware.authAdmin, MindfulnessVideosController.delete);


module.exports = router;
