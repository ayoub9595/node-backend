const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-token', auth, userController.verifyToken);

module.exports = router;