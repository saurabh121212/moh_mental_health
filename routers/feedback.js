const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const FeedbackController = require('../controllers/feedbackControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is used to add a new feedback
router.post('/add',[
    body('nurse_system_generated_name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Question must be between 3 and 100 characters long'),

    body('usability_stars')
    .isLength({ min: 1, max: 5 })
    .withMessage('Usability stars must be between 1 and 5 characters long'),
    body('usability_feedback')
    .isLength({ min: 3, max: 400 })
    .withMessage('Usability Feedback must be between 3 and 400 characters long'),
    body('performance_stars')
    .isLength({ min: 1, max: 5 })
    .withMessage('Performance stars must be between 1 and 5 characters long'),
    body('performance_feedback')
    .isLength({ min: 3, max: 400 })
    .withMessage('Performance Feedback must be between 3 and 400 characters long'),
    body('personalization_stars')
    .isLength({ min: 1, max: 5 })
    .withMessage('Personalization stars must be between 1 and 5 characters long'),
    body('personalization_feedback')
    .isLength({ min: 3, max: 400 })
    .withMessage('Personalization Feedback must be between 3 and 400 characters long'),
    body('security_stars').isLength({ min: 1, max: 5 })
    .withMessage('Security stars must be between 1 and 5 characters long'),
    body('security_feedback')
    .isLength({ min: 3, max: 400 })
    .withMessage('Security Feedback must be between 3 and 400 characters long'),
    body('overall_satisfaction_stars')
    .isLength({ min: 1, max: 5 })
    .withMessage('Overall stars must be between 1 and 5 characters long'),
    body('overall_satisfaction_feedback')
    .isLength({ min: 3, max: 400 })
    .withMessage('Overall Feedback must be between 3 and 400 characters long'),
], authMiddleware.authUser, FeedbackController.add);


// This is used in Mobile app to get the list of FAQs
router.get('/list-mobile', authMiddleware.authUser, FeedbackController.getMobile);

// This is used in Admin panel to get the list of FAQs
router.get('/list', authMiddleware.authAdmin, FeedbackController.get);


module.exports = router;
