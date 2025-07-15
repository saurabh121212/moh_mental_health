const router = require('express').Router();
const FileController = require('../controllers/file.controller');
const uploader = require('../middleware/uploads');

router.post('/problem-focused-strategies-image',  uploader("image", 20, "problemFocusedImage").single("file"), FileController.uploadFile);

router.post('/healthy-lifestyle-image',  uploader("image", 20, "healthyLifestyleImage").single("file"), FileController.uploadFile);

router.post('/education-resources-image',  uploader("image", 20, "educationResourcesImage").single("file"), FileController.uploadFile);

router.post('/category-image',  uploader("image", 20, "categoryImage").single("file"), FileController.uploadFile);


// router.post('/gallery-image', uploader("image", 20, "galleryImage").array("file",15), FileController.uploadMultipleFiles);

module.exports = router;




