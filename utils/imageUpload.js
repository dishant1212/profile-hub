const multer = require('multer');
const storage = require('../config/storage');

const imageUpload = multer({ storage });

module.exports = imageUpload;
