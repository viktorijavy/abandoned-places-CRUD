const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Place = require('./models/Place')
const morgan = require('morgan')

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

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/places', async (req, res) => {
   const places = await Place.find()
    res.render('places/index', { places })
})

app.post('/places', async (req, res) => {
    
    const place = new Place(req.body);
    await place.save();
    res.redirect(`/places`)
})

app.get('/places/new', (req, res) => {
  res.render('places/new')
})

app.get('/places/:id', async (req, res) => {
   
    const place = await Place.findById(req.params.id)
    res.render('places/show', { place });
});

app.get('/places/:id/edit', async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place })
})

app.post('/places/:id/edit', (req, res) => {
    const id = req.params.id
    const { title, location, description, image } = req.body
    Place.findByIdAndUpdate(id, { title, location, description, image}, {new: true})
    .then(() => {
        res.redirect(`/places/${id}`)
    })
    .catch(error => next(error))
})

app.post('/places/:id/delete', async (req, res) => {
    const id = req.params.id;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
})

app.listen(3000, () => {
    console.log('Listening on port3000')
})