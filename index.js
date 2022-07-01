const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
// const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const env = require('./config/environment');

// for session cookie

// STEP 6
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// STEP 9
const MongoStore = require('connect-mongo');

//Sass
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');

const flashMware=require('./config/middleware');

// setup chat server to be used with socket.io
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat Server listening on port 5000');

const path = require('path');

app.use(sassMiddleware({
    // src- from where to access files
    src: './assets/scss',
    // dest- where to put css files
    dest: './assets/css',
    // debug: if true shows error during conversion of file
    debug: true,
    //outputStyle
    outputStyle: 'expanded',
    //prefix - where shud server look for css files
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// if (env.name==='development') {
//     app.use(sassMiddleware({
//         // src- from where to access files
//         src: path.join(__dirname,'./assets','scss'),
//         // dest- where to put css files
//         dest: path.join(__dirname,'./assets','css'),
//         // debug: if true shows error during conversion of file
//         debug: true,
//         //outputStyle
//         outputStyle: 'expanded',
//         //prefix - where shud server look for css files
//         prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
//     }));
// }

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
// app.use(expressLayouts);

// making uploads path available to browser
app.use('/uploads',express.static(__dirname+'/uploads'));

//extract style and scripts from sub pages into layout
// app.set('layout extractStyles',true);
// app.set('layout extractScripts',true);

//set-up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store session cookie in db

// STEP 7
app.use(session({
    name: 'social_media_app',
    //encryption key
    secret: 'whiadcpaeqrgqvskgyeccipbyrmdlarwuqqltyiuojaixogujn',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    // STEP 10                                       
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost:27017',
            autoRemove:'disabled'
        },
        function(err)
        {
            console.log(err || 'mongodb setup is ok');
        }
    )
}));

// STEP 8
app.use(passport.initialize());
app.use(passport.session());
app.set(passport.setAuthenticatedUser);

//since flash messages stored in session cookies so setup after session
app.use(flash());
app.use(flashMware.setFlash);

//use express router for any requests coming after localhost ie url: /...
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server running on port : ${port}`);
})
