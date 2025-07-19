const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const MoodController = require('../controllers/moodControllers');
const authMiddleware = require('../middleware/auth.middleware');

// This is used to add Moods to the database
// It requires the user to be authenticated as an User
router.post('/add',[
    body('mood_name')
    .isLength({ min: 3, max: 400 })
    .withMessage('Mood Name must be between 3 and 500 characters long'),

    body('mood_code').notEmpty().withMessage('Mood Code is required. It must be 1,2,3'),

    body('user_id').notEmpty().withMessage('User ID is required. It must be a valid user ID'),
], authMiddleware.authUser, MoodController.add);


// This is used in Mobile app to get the list of Moods 
router.get('/list-mobile', authMiddleware.authUser, MoodController.getMobile);

// This is used in Admin panel to get the list of Moods 
router.get('/list', authMiddleware.authAdmin, MoodController.get);


router.get('/mood-statistics/:id', authMiddleware.authUser, MoodController.getMoodStatistics);



module.exports = router;
