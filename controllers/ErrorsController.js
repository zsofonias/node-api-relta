const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0].slice(1, -1);
  const message = `Invalid Request, Duplicate value: ${value}, not allowed.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(e => e.message);
  const message = `Validation Error: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendDevError = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendProdError = (err, req, res) => {
  if (err.isOperational) {
    console.log(err.message);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  console.error('Production APIError: ', err);
  return res.status(500).json({
    status: 'error',
    message: 'Sorry, Something went wrong'
  });
};

const errorDispatcher = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if ((process.env.NODE_ENV = 'production')) {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendProdError(error, req, res);
  }
};

module.exports = { errorDispatcher };
