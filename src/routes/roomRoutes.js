const express = require('express');
 const router = express.Router();
 // Import room controller
 const { getAllRooms, createRoom, getRoomById, updateRoom, deleteRoom } = require('../controllers/roomController');
 const { protect, authorize } = require('../middleware/authMiddleware');

 // ANYONE can get all rooms
 router.get('/', getAllRooms);

 // Create a new room
 router.post('/', createRoom);

 // Get a specific room by ID
 router.get('/:id', getRoomById);

 // Update a room
 router.put('/:id', updateRoom);

 // Delete a room
 router.delete('/:id', deleteRoom);

 module.exports = router;