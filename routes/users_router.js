const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const AuthMiddlewares = require('../middlewares/authMiddlewares');

// auth routes
router.post('/register', AuthController.registerUser);
router.get('/activate-account/:token', AuthController.activateUser);
router.post('/login', AuthController.loginUser);

router.use(AuthMiddlewares.protect);

// admin routes
router.use(AuthMiddlewares.restrictTo('admin'));
router
  .route('/')
  .get(UsersController.getAllUsers)
  .post(UsersController.createUser);

router
  .route('/:id')
  .get(UsersController.getUser)
  .patch(UsersController.updateUser)
  .delete(UsersController.deleteUser);

module.exports = router;
