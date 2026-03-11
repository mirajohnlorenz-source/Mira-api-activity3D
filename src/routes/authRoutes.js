// In routes/authRoutes.js
 const express = require('express');
 const router = express.Router();
 const { protect, authorize } = require('../middleware/authMiddleware');
 const { registerUser, loginUser } = require('../controllers/authController');

 router.get('/', getDishes); 

 router.post('/register', registerUser);
 router.post('/login', loginUser);
 router.post('/', protect, authorize('admin', 'manager'), createDish);

 module.exports = router;