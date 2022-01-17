const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//to include virtuals in res.json() we need to set toJSON schema option to {virtuals: true} and we pass that into our schema
const opts = { toJSON: { virtuals: true } };

const placeSchema = new Schema ({
    title: String,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    images: [
        { 
            url: String,
            filename: String
        }
    ],
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

placeSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <a href="/places/${this._id}"> ${this.title}</a>
    <p> ${this.description.substring(0, 30)} </p>`
})

const Place = mongoose.model('Place', placeSchema)
module.exports = Place