
const multer = require('multer');

// Set up the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
// Specify the destination folder for uploaded files
     return cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
// Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now();
   return cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Set up the upload middleware using multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Maximum file size 5MB
  },
});

module.exports =upload;


