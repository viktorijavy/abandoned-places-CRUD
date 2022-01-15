const Place = require('./models/Place')

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const id = req.params.id
    const place = await Place.findById(id)
    if (!place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`places/${id}`)
    }
    next()
}