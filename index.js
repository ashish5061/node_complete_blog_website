require('dotenv').config();

const express = require('express')

const { config, engine } = require('express-edge');
const edge = require('edge.js')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
 const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const connectFlash = require('connect-flash')
const cloudinary = require('cloudinary')


const createPostControllers = require('./controllers/createPost')
const homePageControllers = require('./controllers/homepage')
const storePostControllers = require('./controllers/storePost')
const getPostControllers = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const auth = require("./middleware/auth");
const redirectIfAuthenticate = require('./middleware/redirectifAuthenticated')
const logoutController= require('./controllers/logout')



const app = new express()
mongoose.connect(process.env.DB_URL)

app.use(connectFlash());



app.use(session({
    secret: process.env.Express_session_key,
  
    store: MongoStore.create({ mongoUrl: process.env.DB_URL})
  }));
   
cloudinary.config({
    api_key: process.env.cloud_api_key,
    api_secret:process.env.cloud_api_secret,
    cloud_name: process.env.cloud_name
})


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(express.static('public'))



app.use(engine);

app.set('views', `${__dirname}/views`);

app.use('*',(req,res,next) => {
    edge.global('auth',req.session.userId)
    next()
})


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

const storePost = require('./middleware/storePost')

app.use('/posts/store', storePost)
app.use('/posts/new',auth)



app.get("/", homePageControllers)

app.get('/posts/new',auth,createPostControllers)

app.post('/posts/store',auth,storePost, storePostControllers)

app.get('/auth/logout', auth,logoutController)
app.get("/auth/login",  loginController)

app.post("/users/login", redirectIfAuthenticate, loginUserController )

app.get('/post/:id',getPostControllers);


app.get("/auth/register",redirectIfAuthenticate, createUserController)
app.post('/users/register',redirectIfAuthenticate,storeUserController)
app.use((req,res)=> {
    res.render('not-found')
})




app.listen(process.env.PORT,() => {
    console.log(`APP listening on port ${process.env.PORT}`)

})




