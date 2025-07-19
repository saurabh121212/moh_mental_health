const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const CadresController = require('../controllers/cadresController');
const authMiddleware = require('../middleware/auth.middleware');

// This is user to add Cadres to the database
// It validates the input data and then calls the controller to add the data
router.post('/add',[
    body('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 20 characters long'),

],authMiddleware.authAdmin, CadresController.add);

// This is used to update Cadres in the database
router.put('/update/:id',[
    body('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 20 characters long'),

] ,authMiddleware.authAdmin, CadresController.update);


// This is used in Admin panel to get the list of Cadres
router.get('/list',authMiddleware.authAdmin, CadresController.get);

// This is used in Mobile app to get the list of Cadres
router.get('/list-mobile', CadresController.getMobile);

// This is used to delete Cadres from the database
router.put('/delete/:id', authMiddleware.authAdmin, CadresController.delete);


module.exports = router;
