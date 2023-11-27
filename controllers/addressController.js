const Address = require('../models/addressModel')
const mongoose = require('mongoose')

// get all addresses for a single user
const getAddresses = async (req, res) => {
    const user_id = req.user._id

    const addresses = await Address.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(addresses)
}

// get a single address 
const getAddress = async (req, res) => {
    const { id } = req.params
    
    // Check if ID is a valid doc in MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such address'})
    }

    // Attempt to find address by ID
    const address = await Address.findById(id)

    // If no address is found return an error
    if (!address) {
        return res.status(404).json({error: 'No such address'})
    }

    // If address is found, returns it
    res.status(200).json(address)
}

// create new address
const createAddress = async (req, res) => {
    const {streetAddress, city, state, zipCode, zipPlus4} = req.body

    let emptyFields = []

    if(!streetAddress) {
        emptyFields.push('streetAddress')
    }
    if(!city) {
        emptyFields.push('city')
    }
    if(!state) {
        emptyFields.push('state')
    }
    if(!zipCode) {
        emptyFields.push('zipCode')
    }
    // ZipPlus4 is opitional. No need to check emptiness

    // If any required field is empty, returns an error
    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all fields', emptyFields})
    }

    // If above conditions are satisified, create a new doc to db
    try {
        const user_id = req.user._id
        const address = await Address.create({ streetAddress, city, state, zipCode, zipPlus4, user_id})
        res.status(200).json(address)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a single address
const deleteAddress = async (req,res) => {
    const { id } = req.params

    // Check if ID is a valid doc in MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such address'})
    }

    // Attempt to find and delete the address by its ID
    const address = await Address.findOneAndDelete({_id: id})

    // If no address is found, returns an error
    if (!address) {
        return res.status(400).json({error: 'No such address'})
    }
    
    // If an address is found and deleted, returns it
        res.status(200).json(address)
}

//update an Address 
const updateAddress = async (req,res) => {
    const { id } = req.params

    // Check if ID is a valid doc in MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such address'})
    }

    // Attempt to find and update address by its ID
    const address = await Address.findOneAndUpdate({_id: id}, {
        ...req.body
    }, {new: true}) // 'new: true' returns the updated doc

    // If no address is found, returns an error
    if (!address) {
        return res.status(400).json({error: 'No such address'})
    }

    // If an address is found and updated, return it
    res.status(200).json(address)   
}

// Compare an address
const compareAddress = async (req, res) => {
    const { streetAddress, city, state, zipCode } = req.body;

    try {
        // Exact Match
        const exactMatch = await Address.findOne({ streetAddress, city, state, zipCode });
        if (exactMatch) {
            return res.status(200).json({ match: true, type: 'exact', address: exactMatch });
        }

        // Near Match on Zip Code + 4
        const nearMatch = await Address.find({
            streetAddress, 
            city, 
            state, 
            zipCode: { $regex: new RegExp("^" + zipCode.slice(0, 5)) }
        });

        if (nearMatch && nearMatch.length > 0) {
            // Return the first near match as the suggested address
            return res.status(200).json({ match: true, type: 'near', address: nearMatch[0] });
        }

        // No Match Found
        return res.status(404).json({ match: false, message: 'No matching address found' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getAddresses,
    getAddress,
    createAddress,
    deleteAddress,
    updateAddress,
    compareAddress
} 