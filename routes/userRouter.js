const express = require('express')
const userController = require('../controllers/userController')
const { verifyToken } = require('../middlewares/verifyToken')

const router = express.Router()

router.get('/data', verifyToken, userController.getData)

module.exports = router