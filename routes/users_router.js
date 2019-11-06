const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.registerUser);
router.get('/activate-account/:token', AuthController.activateUser);

// admin routes
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
