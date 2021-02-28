const Post = require('../database/models/Post.js')

module.exports = async(req,res) => {

    const posts = await Post.find({}).populate('auther');
    console.log(posts)
    res.render('index',{
        posts
    })

}
