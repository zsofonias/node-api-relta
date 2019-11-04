const crudFactory = require('./crudFactory');

const RealEstate = require('../models/RealEstate');

const safe_query_params = [
  'id',
  'name',
  'lotSize',
  'bedRoomCount',
  'bathRoomCount',
  'listingType',
  'price',
  'realtor'
];

const getAllRealEstates = crudFactory.getAll(RealEstate, safe_query_params);

const createRealEstate = crudFactory.createOne(RealEstate);

const getRealEstate = crudFactory.getOne(RealEstate);

const updateRealEstate = crudFactory.updateOne(RealEstate);

const deleteRealEstate = crudFactory.deleteOne(RealEstate);

module.exports = {
  getAllRealEstates: getAllRealEstates,
  createRealEstate: createRealEstate,
  getRealEstate: getRealEstate,
  updateRealEstate: updateRealEstate,
  deleteRealEstate: deleteRealEstate
};
