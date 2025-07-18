const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const FAQsController = require('../controllers/faqControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is used to add FAQs to the database
// It requires the user to be authenticated as an admin
router.post('/add',[
    body('question')
    .isLength({ min: 3, max: 200 })
    .withMessage('Question must be between 3 and 200 characters long'),

    body('answer')
    .isLength({ min: 3, max: 600 })
    .withMessage('Question must be between 3 and 600 characters long'),
], authMiddleware.authAdmin, FAQsController.add);

// This is used to update FAQs in the database
router.put('/update/:id',[
    body('question')
    .isLength({ min: 3, max: 200 })
    .withMessage('Question must be between 3 and 200 characters long'),

    body('answer')
    .isLength({ min: 3, max: 600 })
    .withMessage('Question must be between 3 and 600 characters long'),
] , authMiddleware.authAdmin, FAQsController.update);

// This is used in Mobile app to get the list of FAQs
router.get('/list-mobile', authMiddleware.authUser, FAQsController.getMobile);

// This is used in Admin panel to get the list of FAQs
router.get('/list', authMiddleware.authAdmin, FAQsController.get);

// This is used to delete FAQs from the database
router.put('/delete/:id',authMiddleware.authAdmin, FAQsController.delete);

module.exports = router;
