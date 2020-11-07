const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/logged', (req, res) => {
    if (req.user !== undefined) {
        res.render('logged');
    } else {
        res.render('noPermission');
    }
    console.log('req.user:', req.user);
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

module.exports = router;