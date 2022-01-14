const express = require('express');
const router = express.Router();

const Place = require('../models/Place')
const Review = require('../models/Review')



router.post('/places/:id/reviews', async (req, res) => {
    const place = await Place.findById(req.params.id)
    const review = new Review(req.body.review)
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/places/${place._id}`)
})

router.post('/places/:id/reviews/:reviewId/delete', async (req, res) => {
    const { id, reviewId } = req.params
    await Place.findByIdAndUpdate( id, { $pull: { reviews: reviewId } } )
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/places/${id}`)
})

module.exports = router;