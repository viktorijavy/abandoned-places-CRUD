const express = require('express');
const router = express.Router();

const Place = require('../models/Place')


router.get('/places', async (req, res) => {
    
    const places = await Place.find()
     res.render('places/index', { places })
 })
 
 router.post('/places', async (req, res) => {
     
     const place = new Place(req.body);
     await place.save();
     res.redirect(`/places`)
 })
 
 router.get('/places/new', (req, res) => {
     
   res.render('places/new')
 })
 
 router.get('/places/:id', async (req, res) => {
     const place = await Place.findById(req.params.id).populate('reviews')
     res.render('places/show', { place });
 });
 
 router.get('/places/:id/edit', async (req, res) => {
     const place = await Place.findById(req.params.id)
     res.render('places/edit', { place })
 })
 
 router.post('/places/:id/edit', (req, res) => {
     const id = req.params.id
     const { title, location, description, image } = req.body
     Place.findByIdAndUpdate(id, { title, location, description, image}, {new: true})
     .then(() => {
         res.redirect(`/places/${id}`)
     })
     .catch(err => next(err))
 })
 
 router.post('/places/:id/delete', async (req, res) => {
     const id = req.params.id;
     await Place.findByIdAndDelete(id);
     res.redirect('/places');
 })
 
 

 module.exports = router;