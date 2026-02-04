
const mongoose = require('mongoose');
// This is the "Rule Book" for a Room
const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number, // Number: 101
    required: true,
    unique: true, // No duplicate room numbers allowed
  },
  type: {
    type: String, // Text: "Single", "Suite"
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false, // Assume room is empty (False) at first
  },
  features: [String], // A list of words: ["WiFi", "TV", "Bath"]
});


module.exports = mongoose.model('Room', roomSchema);
