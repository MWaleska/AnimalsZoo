const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware.verifyToken, userController.getUserProfile);
router.put('/me', authMiddleware.verifyToken, userController.updateUserProfile);

module.exports = router;