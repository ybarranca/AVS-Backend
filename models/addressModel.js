const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AddressSchema = new Schema({
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    zipPlus4: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /^\d{5}(-\d{4})?$/.test(v); // Validates formats like '12345' or '12345-6789'
            },
            message: props => `${props.value} is not a valid zip code!`
        }
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Address', AddressSchema)   