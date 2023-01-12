const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');
const authenticateJWT = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');





