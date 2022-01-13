const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema ({
    title: String,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

const Place = mongoose.model('Place', placeSchema)
module.exports = Place