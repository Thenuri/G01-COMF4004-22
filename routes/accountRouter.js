const express = require('express');
const router = express.Router();
const authWithJWT = require('../middleware/authMiddleware')
const accountController = require('../controllers/accountController')

router.put('/suspend/:accountId', authWithJWT, accountController.suspendAccount)
router.put('/activate/:accountId', authWithJWT, accountController.activateAccount)


module.exports = router

