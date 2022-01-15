const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();

const Place = require('../models/Place')


router.get('/places', async (req, res) => {

    const places = await Place.find()
    res.render('places/index', { places })
})

router.post('/places', isLoggedIn, async (req, res) => {
    const place = new Place(req.body);
    await place.save();
    req.flash('success', 'new location added')
    res.redirect(`/places`)
})

router.get('/places/new', isLoggedIn, (req, res) => {
    res.render('places/new')
})

router.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews')
    res.render('places/show', { place });
});

router.get('/places/:id/edit', isLoggedIn, async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place })
})

router.post('/places/:id/edit', isLoggedIn, (req, res) => {
    const id = req.params.id
    const { title, location, description, image } = req.body
    Place.findByIdAndUpdate(id, { title, location, description, image }, { new: true })
        .then(() => {
            res.redirect(`/places/${id}`)
        })
        .catch(err => next(err))
})

router.post('/places/:id/delete', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
})



module.exports = router;