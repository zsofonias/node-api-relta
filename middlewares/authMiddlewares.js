const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const User = require('../models/User');

const protect = catchAsync(async (req, res, next) => {
  console.log('Headers: ', req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return next(new AppError('Access Denied: Login Required', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('Authentication Failed: User no longer Exists', 400)
    );
  }

  if (currentUser.isPasswordChanged(decoded.iat)) {
    // check if user password was changed after token was issued
    return next(
      new AppError('Access Denied: Token has Expired, Login Required', 401)
    );
  }
  req.user = currentUser;
  next();
});

// authorization, check if user has access permission
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Access Denied: Higher Permission Required', 401)
      );
    }
    next();
  };
};

module.exports = {
  protect: protect,
  restrictTo: restrictTo
};
