const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const SupportResourcesController = require('../controllers/supportResourcesController');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Emergency Resources to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

   body('services')
    .isLength({ min: 0, max: 100 })
    .withMessage('services max 100 characters long'),

   body('address')
    .isLength({ min: 0, max: 50 })
    .withMessage('services max 50 characters long'),
    

    body('phone_number')
    .isLength({ min: 0, max: 20 })
    .withMessage('Phone number max 20 characters long'),

    body('operating_days')
    .isLength({ min: 0, max: 150 })
    .withMessage('Operating days max 150 characters long'),

    body('operating_hours')
    .isLength({ min: 0, max: 150 })
    .withMessage('Operating hours max 150 characters long'),

    body('category_id'),
    body('category_name'),
    body('category_url')
  
], authMiddleware.authAdmin, SupportResourcesController.add);

// This is used to update Emergency Resources in the database
router.put('/update/:id',[
     body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters long'),

   body('services')
    .isLength({ min: 0, max: 100 })
    .withMessage('services max 100 characters long'),

   body('address')
    .isLength({ min: 0, max: 80 })
    .withMessage('services max 80 characters long'),
    

    body('phone_number')
    .isLength({ min: 0, max: 20 })
    .withMessage('Phone number max 20 characters long'),

    body('operating_days')
    .isLength({ min: 0, max: 150 })
    .withMessage('Operating days max 150 characters long'),

    body('operating_hours')
    .isLength({ min: 0, max: 150 })
    .withMessage('Operating hours max 150 characters long'),

    body('category_id'),
    body('category_name'),
    body('category_url')
] , authMiddleware.authAdmin, SupportResourcesController.update);

// This is used in Mobile app to get the list of Emergency Resources
router.get('/list-mobile', authMiddleware.authUser, SupportResourcesController.getMobile);

// This is used in Admin panel to get the list of Emergency Resources
router.get('/list', authMiddleware.authAdmin, SupportResourcesController.get);

// This is used to delete Emergency Resources from the database
router.put('/delete/:id', authMiddleware.authAdmin, SupportResourcesController.delete);


module.exports = router;
