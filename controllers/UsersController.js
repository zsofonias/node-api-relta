const crudFactory = require('./crudFactory');

const User = require('../models/User');

const safe_query_params = ['id', 'email', 'role', 'active'];

const getAllUsers = crudFactory.getAll(User, safe_query_params);

const getUser = crudFactory.getOne(User);

const createUser = crudFactory.createOne(User);

const updateUser = crudFactory.updateOne(User);

const deleteUser = crudFactory.deleteOne(User);

module.exports = {
  getAllUsers: getAllUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
