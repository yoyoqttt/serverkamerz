const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const Room = require('./models/Room');

const app = express();
const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
     cb(
       null,
        file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()
       );
  },
});

const upload = multer({ storage: storage });

app.post('/api/rooms', upload.array('images'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const coordinates = JSON.parse(req.body.coordinates);
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const newRoom = new Room({
      title,
      description,
      location: {
        type: 'Point',
        coordinates: coordinates,
      },
      price,
      images,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room', error });
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Server is running on port ${port}`));