const express = require('express');
const router = express.Router();
const User = require('../model/User');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

// route  POST /api/auth/signup
// desc   register a user
// public
router.post(
  '/signup',
  [
    check('name', 'enter a name').notEmpty(),
    check('name', 'Name must be between 4 and 10 characters').isLength({
      min: 4,
      max: 10,
    }),
    check('email', 'enter a valid email').normalizeEmail().isEmail(),
    check('password', 'enter a password').notEmpty(),
    check('password', 'password must be between 4 and 10 characters').isLength({
      min: 4,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const newUser = await new User({ name, email, password });
    await User.register(newUser, password, (error, user) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      res.status(200).json(user);
    });
  }
);

// route  POST /api/auth/signin
// desc   login a user
// public
router.post('/signin', (req, res) => {
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
  })(req, res);
});

// route  GET /api/auth/signout
// desc   logout a user
// private
router.get('/signout', (req, res) => {
  res.clearCookie('next-connect.sid');
  req.logOut();
  res.json({ msg: 'you are now signout' });
});

module.exports = router;
