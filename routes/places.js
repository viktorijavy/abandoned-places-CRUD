const express = require('express');
const { isLoggedIn, isAuthor } = require('../middleware');
const router = express.Router();
const { storage } = require('../cloudinary/cloudinary-config')
const Place = require('../models/Place')
const multer = require('multer');
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})


router.get('/places', async (req, res) => {

    const places = await Place.find()
    res.render('places/index', { places })
})

router.post('/places', isLoggedIn, upload.array('image'), async (req, res) => {
    
   const geoData = await geocoder.forwardGeocode({
       
        query: req.body.location,
        limit: 1
    }).send()
    console.log('cia yra geodata', geoData.body.features)
    res.send(geoData.body.features[0].geometry.coordinates)
    // const place = new Place(req.body);
    // place.images = req.files.map(f => ({url: f.path, filename: f.filename }))
    // place.author = req.user._id
    // await place.save();
    // console.log('place', place)
    // req.flash('success', 'new location added')
    // res.redirect(`/places`)
})



router.get('/places/new', isLoggedIn, (req, res) => {
    res.render('places/new')
})

router.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    console.log('location is', place)
    res.render('places/show', { place });
});

router.get('/places/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place })
})

// router.post('/places/:id/edit', isLoggedIn, isAuthor, (req, res) => {
//     const id = req.params.id
//     const { title, location, description, image } = req.body
//     Place.findByIdAndUpdate(id, { title, location, description, image }, { new: true })
    
//         .then(() => {
//             res.redirect(`/places/${id}`)
//         })
//         .catch(err => next(err))
// })

router.post('/places/:id/edit', isLoggedIn, isAuthor, upload.array('image'), async (req, res) => {
    const id  = req.params.id;
    const place = await Place.findByIdAndUpdate(id, { ...req.body });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }))
    place.images.push(...imgs)
    await place.save()
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/places/${place._id}`)
});

router.post('/places/:id/delete', isLoggedIn, isAuthor, async (req, res) => {
    const id = req.params.id;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
})



module.exports = router;