const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, updateUserProfile, addWalletBalance } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/wallet', protect, addWalletBalance);

module.exports = router;
