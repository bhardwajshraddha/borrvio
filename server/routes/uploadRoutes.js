const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('image', 5), uploadImage);

module.exports = router; 
/*const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;*/
