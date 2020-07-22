const User = require('../model/User');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }

      res.json(user);
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  res.clearCookie('next-cookie.sid');
  req.logout();
  res.json({ message: 'You are now signed out!' });
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // console.log('check auth');
    return next();
  }
  res.redirect('/signin');
};
