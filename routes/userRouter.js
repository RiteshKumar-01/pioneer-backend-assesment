const express = require('express')
const userRouter = require('../controllers/userRouter')
const { verifyToken } = require('../middlewares/verifyToken')

const router = express.Router()

router.get('/data', verifyToken, userRouter.getData)

module.exports = router