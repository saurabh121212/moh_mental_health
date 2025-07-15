const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const SelfAssessmentTestController = require('../controllers/selfAssessmentTestController');
const authMiddleware = require('../middleware/auth.middleware');

// This is used to add a new self-assessment test
// It requires the user to be authenticated as an User
router.post('/add',[
    body('overwhelmed').notEmpty().withMessage('Overwhelmed must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('trouble_sleeping').notEmpty().withMessage('Trouble sleeping must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('experiencing_physical_symptoms').notEmpty().withMessage('Experiencing physical symptoms must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('frequent_exhaustion').notEmpty().withMessage('Frequent exhaustion must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('lost_motivation').notEmpty().withMessage('Lost motivation must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('quitting_your_job').notEmpty().withMessage('Quitting your job must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('lost_interest').notEmpty().withMessage('Lost interest must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('section_1_score'),
    body('stress_recognition_ability').notEmpty().withMessage('Stress recognition ability must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('stress_management_ability').notEmpty().withMessage('Stress management ability must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('getting_enough_rest').notEmpty().withMessage('Getting enough rest must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('physically_active').notEmpty().withMessage('Physically active must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('annual_check_ups').notEmpty().withMessage('Annual check-ups must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('supported_at_work').notEmpty().withMessage('Supported at work must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('workload_manageable').notEmpty().withMessage('Workload manageable must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('support_system').notEmpty().withMessage('Support system must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('respected_in_relationships').notEmpty().withMessage('Respected in relationships must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('healthy_coping_strategies').notEmpty().withMessage('Healthy coping strategies must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('spiritual_belief').notEmpty().withMessage('Spiritual belief must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('seek_heap_when_in_need').notEmpty().withMessage('Seek help when in need must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('growing_personally_professionally').notEmpty().withMessage('Growing personally professionally must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('work_life_balance').notEmpty().withMessage('Work life balance must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('sense_purpose_daily').notEmpty().withMessage('Sense of purpose daily must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('section_2_score'),
    body('terminal_chronic_illness').notEmpty().withMessage('Terminal chronic illness must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('traumatic_event').notEmpty().withMessage('Traumatic event must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('personal_harm_or_others').notEmpty().withMessage('Personal harm or others must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('sadness_and_hopelessness').notEmpty().withMessage('Sadness and hopelessness must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('alcohol_use').notEmpty().withMessage('Alcohol use must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('substance_use').notEmpty().withMessage('Substance use must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('unhealthy_eating_habits').notEmpty().withMessage('Unhealthy eating habits must be 1,2,3. 1 is for Always, 2 is for No, 3 is for Sometimes '),
    body('section_3_score'),
    body('test_score'),
    body('test_overall_result'),
    body('user_id').notEmpty().withMessage('User ID is required'),
], authMiddleware.authUser, SelfAssessmentTestController.add);


// This is used in Mobile app to get the list of Moods 
router.get('/list-mobile', authMiddleware.authUser, SelfAssessmentTestController.getMobile);

// This is used in Admin panel to get the list of Moods 
router.get('/list', authMiddleware.authAdmin, SelfAssessmentTestController.get);


module.exports = router;
