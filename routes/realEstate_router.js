const express = require('express');

const router = express.Router();

const RealEstateController = require('../controllers/RealEstateController');

router
  .route('/')
  .get(RealEstateController.getAllRealEstate)
  .post(RealEstateController.createRealEstate);

router
  .route('/:id')
  .get(RealEstateController.getRealEstate)
  .patch(RealEstateController.updateRealEstate)
  .delete(RealEstateController.deleteRealEstate);

module.exports = router;
