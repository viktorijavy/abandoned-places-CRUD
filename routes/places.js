const express = require('express');
const { isLoggedIn, isAuthor } = require('../middleware');
const router = express.Router();
const { storage } = require('../cloudinary/cloudinary-config')
const Place = require('../models/Place')
const multer = require('multer');
const upload = multer({ storage });


router.get('/places', async (req, res) => {

    const places = await Place.find()
    res.render('places/index', { places })
})

// router.post('/places', isLoggedIn, async (req, res) => {
//     const place = new Place(req.body);
//     place.author = req.user._id
//     await place.save();
//     req.flash('success', 'new location added')
//     res.redirect(`/places`)
// })

router.post('/places', upload.array('image'), (req, res) => {
    console.log(req.body, req.files)
    res.send('it worked!')
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

router.post('/places/:id/edit', isLoggedIn, isAuthor, (req, res) => {
    const id = req.params.id
    const { title, location, description, image } = req.body
    Place.findByIdAndUpdate(id, { title, location, description, image }, { new: true })
        .then(() => {
            res.redirect(`/places/${id}`)
        })
        .catch(err => next(err))
})

router.post('/places/:id/delete', isLoggedIn, isAuthor, async (req, res) => {
    const id = req.params.id;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
})



module.exports = router;