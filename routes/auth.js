const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const user = new User({ email, username})
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    res.redirect('/places')
})



// router.get('/login', (req, res) => {
//     res.render('users/login');
// })

module.exports = router;