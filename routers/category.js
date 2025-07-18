const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const CategoryController = require('../controllers/categoryControllers');
const authMiddleware = require('../middleware/auth.middleware');


// This is user to add Category to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters long'),

    body('url')    
],authMiddleware.authAdmin, CategoryController.add);

// This is used to update Category in the database
router.put('/update/:id',[
    body('name')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters long'),

    body('url')      
] ,authMiddleware.authAdmin, CategoryController.update);


// This is used in Admin panel to get the list of Category
router.get('/list',authMiddleware.authAdmin, CategoryController.get);

// This is used to delete Category from the database
router.put('/delete/:id', authMiddleware.authAdmin, CategoryController.delete);


module.exports = router;
