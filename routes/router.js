const express = require('express')
const authRouter = require('../routes/authRouter')
const userRouter = require('../routes/userRouter')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

module.exports = router