const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/logged', (req, res) => {
    if (req.user !== undefined) {
        console.log('req.user:', req.user);
        res.render('logged', {name: req.user.displayName, avatar: req.user.photos[0].value});
    } else {
        res.render('noPermission');
    }
    
});

router.get('/no-permission', (req, res) => {
    res.render('noPermission');
});

router.get('/profile', (req, res) => {
    if (req.user !== undefined) {
        res.render('profile');
    } else {
        res.render('noPermission');
    }
    console.log('req.user:', req.user);
});

router.get('/profile/settings', (req, res) => {
    if (req.user !== undefined) {
        res.render('profileSettings');
    } else {
        res.render('noPermission');
    }
    console.log('req.user:', req.user);
});

router.get('/auth.logout', (req, res) => {
    res.render('logOut');
});

module.exports = router;