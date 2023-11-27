const express = require('express')

// Controller functions
const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router()

// Login route
router.post('/signon', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router 