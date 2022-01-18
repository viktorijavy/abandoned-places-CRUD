if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const flash = require('connect-flash');

const session = require('express-session');
const MongoStore = require('connect-mongo')


const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/abandoned-places";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });


const app = express();
app.use(cookieParser())

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'mousedog';

// const store = new MongoStore({
//   url: MONGO_URI,
//   secret: 'mousedog',
//   touchAfter: 24 * 60 * 60
// })

// store.on("error", function (e) {
//   console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
  
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
			mongoUrl: MONGO_URI
    })
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log('this is req session info', req.session)
    
    res.locals.user = req.user;
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const places = require("./routes/places")
app.use("/", places)

const reviews = require("./routes/reviews")
app.use("/", reviews)

const auth = require('./routes/auth');
app.use("/", auth)


app.get('/', (req, res) => {
    res.render('home')
})

require("./error-handling")(app)

app.listen(3000, () => {
    console.log('Listening on port3000')
})