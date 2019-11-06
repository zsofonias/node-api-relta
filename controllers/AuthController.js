const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const createToken = user => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

sendResWithToken = (user, statusCode, res) => {
  const token = createToken(user);
  user.password = undefined;
  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const registerUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const accountActivationToken = newUser.createAccountActivationToken();
  await newUser.save({ validateBeforeSave: false });
  const accountActiavtionUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/activate-account/${accountActivationToken}`;

  console.log('Activation Token: ', accountActivationToken);
  // send email with account activation url

  return res.status(201).json({
    status: 'success',
    message: 'Account Actvation Token sent to email'
  });
});

const activateUser = catchAsync(async (req, res, next) => {
  const hashedActivationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    accountActivationToken: hashedActivationToken,
    accountActivationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(
      new AppError('Request Denied: Token invalid or has expired', 400)
    );
  }

  user.active = true;
  user.accountActivationToken = undefined;
  user.accountActivationExpires = undefined;
  await user.save({ validateBeforeSave: false });
  sendResWithToken(user, 200, res);
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('User email and password are required', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 400));
  }
  sendResWithToken(user, 200, res);
});

module.exports = {
  registerUser: registerUser,
  activateUser: activateUser,
  loginUser: loginUser
};
