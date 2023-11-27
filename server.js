require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const addressRoutes = require('./routes/addresses')
const userRoutes = require('./routes/user')

// express app 
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/addresses', addressRoutes)
app.use('/api/user', userRoutes)


// connect to DB
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT || 4000, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
