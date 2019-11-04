const express = require('express');

const router = express.Router();

const RealEstatesController = require('../controllers/RealEstatesController');

router
  .route('/')
  .get(RealEstatesController.getAllRealEstates)
  .post(RealEstatesController.createRealEstate);

router
  .route('/:id')
  .get(RealEstatesController.getRealEstate)
  .patch(RealEstatesController.updateRealEstate)
  .delete(RealEstatesController.deleteRealEstate);

module.exports = router;
