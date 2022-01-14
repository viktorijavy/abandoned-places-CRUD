const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')


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


app.get('/', (req, res) => {
    res.render('home')
})

const places = require("./routes/places")
app.use("/", places)

const reviews = require("./routes/reviews")
app.use("/", reviews)

require("./error-handling")(app)

app.listen(3000, () => {
    console.log('Listening on port3000')
})