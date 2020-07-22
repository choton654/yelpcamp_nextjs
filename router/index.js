const express = require('express');
const authController = require('../controller/authcontroller');
const userController = require('../controller/userController');
const postController = require('../controller/postController');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const router = express.Router();

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/**
 * AUTH ROUTES: /api/auth
 */
router.post(
  '/api/auth/signup',
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
      res.status(200).json(newUser);
    });
  }
);
router.post('/api/auth/signin', authController.signin);
router.get('/api/auth/signout', authController.signout);

/**
 * USER ROUTES: /api/users
 */
router.param('userId', userController.getUserById);

router.put(
  '/api/users/follow',
  authController.checkAuth,
  catchErrors(userController.addFollowing),
  catchErrors(userController.addFollower)
);

router.put(
  '/api/users/unfollow',
  authController.checkAuth,
  catchErrors(userController.deleteFollowing),
  catchErrors(userController.deleteFollower)
);

router
  .route('/api/users/:userId')
  .get(userController.getAuthUser)
  .put(
    authController.checkAuth,
    userController.uploadAvatar,
    catchErrors(userController.resizeAvatar),
    catchErrors(userController.updateUser)
  )
  .delete(authController.checkAuth, catchErrors(userController.deleteUser));

router.get('/api/users', userController.getUsers);

router.get('/api/users/profile/:userId', userController.getUserProfile);

router.get(
  '/api/users/feed/:userId',
  authController.checkAuth,
  catchErrors(userController.getUserFeed)
);

/**
 * POST ROUTES: /api/posts
 */
router.param('postId', postController.getPostById);

router.put(
  '/api/posts/like',
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);
router.put(
  '/api/posts/unlike',
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);

router.put(
  '/api/posts/comment',
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);
router.put(
  '/api/posts/uncomment',
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);

router.delete(
  '/api/posts/:postId',
  authController.checkAuth,
  catchErrors(postController.deletePost)
);

router.get('/api/posts', catchErrors(postController.getAllCamps));

router.post(
  '/api/posts/new/:userId',
  authController.checkAuth,
  postController.uploadImage,
  catchErrors(postController.resizeImage),
  catchErrors(postController.addPost)
);

router.get('/api/posts/by/:userId', catchErrors(postController.getPostsByUser));
router.get('/api/posts/feed/:userId', catchErrors(postController.getPostFeed));

module.exports = router;
