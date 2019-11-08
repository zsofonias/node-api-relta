const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/API_features');
const AppError = require('../utils/AppError');

const getAll = (Model, safe_query_params) =>
  catchAsync(async (req, res, next) => {
    let filter = {}; //to handle nested query on a document
    const features = new APIFeatures(
      Model.find(filter),
      safe_query_params,
      req.query
    )
      .filter()
      .sort()
      .narrow()
      .paginate();
    const fetched = await features.query;
    return res.status(200).json({
      status: 'success',
      results: fetched.length,
      requestTime: req.reqTime,
      data: {
        fetched
      }
    });
  });

const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const created = await Model.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        created
      }
    });
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      populateOptions.forEach(option => {
        query = query.populate(option);
      });
    }

    const fetched = await query;
    if (!fetched) {
      return next(new AppError('Resource Not Found', 404));
    }
    return res.status(200).json({
      status: 'success',
      requestTime: req.reqTime,
      data: {
        fetched
      }
    });
  });

const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return next(new AppError('Resource Not Found', 404));
    }
    return res.status(200).json({
      status: 'success',
      requestTime: req.reqTime,
      data: {
        updated
      }
    });
  });

const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new AppError('Resource Not Found', 404));
    }
    return res.status(200).json({
      status: 'success',
      requestTime: req.reqTime,
      data: {
        deleted
      }
    });
  });

module.exports = {
  getAll: getAll,
  getOne: getOne,
  createOne: createOne,
  updateOne: updateOne,
  deleteOne: deleteOne
};
