const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String
    },

    subtitle:{
        type: String
    },

    image: {

        type: String

    },

    

    description:{
        type: String
    },

    content:{
        type: String
    },

    auther:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'true'

    },

    createdAt: {
        type: Date,
        default: new Date()

    }


    

})


const Post = mongoose.model('Post', PostSchema)

module.exports = Post