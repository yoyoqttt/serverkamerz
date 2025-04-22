 const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail=require('../utils/sendEmail');

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
    
const upload = multer({ storage });

router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { lat, lng, address, phone, price } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newRoom = new Room({ imageUrl, location: { lat, lng }, address, phone, price });
        await newRoom.save();
        res.status(201).json({ message: "Room added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Get all rooms
  router.get('/', async (req, res) => {
  try {
      const rooms = await Room.find();
      res.json(rooms);
       
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
  });

  // Get room by ID
  router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
        return res.status(404).json({ msg: 'Room not found' });
    }
    res.json(room);
} catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
    return res.status(404).json({ msg: 'Room not found' });
    }
    res.status(500).send('Server Error');
}
  });

 // Create room request
  router.post('/request/:id', authMiddleware, async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
       const user = req.user;
       if (!room) {
           return res.status(404).json({ msg: 'Room not found' });
       }
       //send an email to the admin

        await sendEmail({
            email: 'to_email@gmail.com', //admin email
            subject: 'Room request received',
            message: `User ${user.name} want to rent the room name ${room.title}.
            User Email: ${user.email}
            Room description: ${room.description}
            `
         })

       res.json({message: 'Request Sent to Admin'});

      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Room not found' });
        }
        res.status(500).send('Server Error');
    }
});
module.exports = router;
 
   
