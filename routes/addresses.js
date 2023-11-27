const express = require('express')
const {
    createAddress,
    getAddresses,
    getAddress,
    deleteAddress,
    updateAddress,
    compareAddress
} = require ('../controllers/addressController')
const requireAuth = require('../middleware/requireauth')

const router = express.Router()

// require auth for all address routes (IF THIS DOES NOT WORK THEN REQUESTS WILL NOT FUNCTION)
router.use(requireAuth)

// GET all Addresses
router.get('/', getAddresses)

// GET an single Address
router.get('/:id', getAddress)

// POST an new Address
router.post('/', createAddress)

// DELETE an Address
router.delete('/:id', deleteAddress)

// UPDATE an Address
router.patch('/:id', updateAddress)

// COMPARE an Address
router.post('/compare', compareAddress)

module.exports = router