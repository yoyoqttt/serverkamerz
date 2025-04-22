const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    location: {
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true }
});

// module.exports = mongoose.model("Room", RoomSchema);

const room = new mongoose.model('Room', RoomSchema)
module.exports = room