const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: [true,'Please provide your username'],
        unique: true
    },
    
    email: {
        type: String,
        required: [true,'Please provide your email'],
        unique: true
    },

    password: {
        type: String,
        required: [true,'Please provide your password'],
        unique: true
    }
})



UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

module.exports = mongoose.model('User', UserSchema)