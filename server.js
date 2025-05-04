// Import & Config
require('dotenv').config();
const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

// Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'api_uploads',
    allowed_formats: ['jpg', 'png', 'webp'], 
    public_id: (req, file) => `file-${Date.now()}`
  }
});
const upload = multer({ storage });

// Express App
const app = express();

// Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    success: true,
    file_url: req.file.path,
    public_id: req.file.filename
  });
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(3000, () => console.log('API Ready 🚀'));