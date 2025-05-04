require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'express-cloudinary',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage: storage });

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/upload', (req, res) => {
    res.render('upload', { 
      message: null,
      error: null,
      imageUrl: null 
    });
  });

  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imageUrl = req.file?.path || null;
      res.render('upload', { 
        message: 'Upload successful!',
        error: null,
        imageUrl 
      });
    } catch (error) {
      console.error(error);
      res.render('upload', { 
        message: 'Upload failed!',
        error: error.message,
        imageUrl: null 
      });
    }
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});