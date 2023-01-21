const express = require('express');
const router = express.Router();
const authService = require('../services/authService')
const jwt = require('jsonwebtoken')

// Routes
router.post('/signin', authService.signIn);

router.post('/signup', authService.signUp)

module.exports = router;