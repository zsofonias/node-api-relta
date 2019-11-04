const getAllRealEstate = (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    requestTime: req.reqTime,
    data: 'All Real Estates'
  });
};

const createRealEstate = (req, res, next) => {
  return res.status(201).json({
    status: 'success',
    requestTime: req.reqTime,
    data: 'Real Estate Created'
  });
};

const getRealEstate = (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    requestTime: req.reqTime,
    data: 'Real Estate Data'
  });
};

const updateRealEstate = (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    requestTime: req.reqTime,
    data: 'Real Estate Updated'
  });
};

const deleteRealEstate = (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    requestTime: req.reqTime,
    data: 'Real Estate Deleted'
  });
};

module.exports = {
  getAllRealEstate: getAllRealEstate,
  createRealEstate: createRealEstate,
  getRealEstate: getRealEstate,
  updateRealEstate: updateRealEstate,
  deleteRealEstate: deleteRealEstate
};
