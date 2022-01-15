const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            
            if (err) return next(err);
            req.flash('success', 'Welcome to abandoned places!')
        res.redirect('/places')
        })
        
    }
    catch {
        req.flash('error', 'Please fill in correctly')
        res.redirect('/register')
    }
    
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/places';
    // delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})
module.exports = router;