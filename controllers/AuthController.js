const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/Email');

const User = require('../models/User');

const createToken = user => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendResWithToken = (user, statusCode, res) => {
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

  try {
    const accountActiavtionUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/activate-account/${accountActivationToken}`;

    const emailMessage = `
    Account created successfully!
    Activate Your account using this link:
    ${accountActiavtionUrl}
    `;
    // send email with account activation url
    const newEmail = new Email(newUser, accountActiavtionUrl);
    await newEmail.send('Activate Your Account', emailMessage);

    return res.status(201).json({
      status: 'success',
      message: 'Account Activation Token sent to email'
    });
  } catch (err) {
    newUser.accountActivationToken = undefined;
    newUser.accountActivationExpires = undefined;
    newUser.save({ validateBeforeSave: false });
    return next(new AppError('Error: Email sending failed'));
  }
});

const resendAccountActivationToken = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Request Failed: Email is required', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Request Denied: Email Does not exist', 400));
  }
  const accountActivationToken = user.createAccountActivationToken();
  await user.save({ validateBeforeSave: false });
  try {
    const accountActiavtionUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/activate-account/${accountActivationToken}`;

    const emailMessage = `
    Activate Your account using this link:
    ${accountActiavtionUrl}
    `;
    const newEmail = new Email(user, accountActiavtionUrl);
    await newEmail.send('Activate Your Account', emailMessage);

    return res.status(201).json({
      status: 'success',
      message: 'Account Activation Token sent to email'
    });
  } catch (err) {
    return next(new AppError('Error: Email sending failed'));
  }
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

const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Request Failed: User Not Found', 404));
  }
  const passwordResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send reset token to email
  try {
    const passwordResetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${passwordResetToken}`;

    const emailMessage = `
      You Have to reset your Password!
      Reset Your Password using this link:
      ${passwordResetUrl}
      `;
    // send passwordResetUrl to email
    const newEmail = new Email(user, passwordResetUrl);
    await newEmail.send('Reset Your Password', emailMessage);

    return res.status(200).json({
      status: 'success',
      message: 'Password Reset Token Sent to Email'
    });
  } catch (err) {
    // user.passwordResetToken = undefined;
    // user.passwordResetExpires = undefined;
    // await user.save({ validateBeforeSave: false });
    return next(new AppError('Error: Email sending failed'));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }
  });
  if (!user) {
    return next(
      new AppError('Request Denied: Token invalid or has expired', 400)
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendResWithToken(user, 200, res);
});

module.exports = {
  registerUser: registerUser,
  activateUser: activateUser,
  loginUser: loginUser,
  forgetPassword: forgetPassword,
  resetPassword: resetPassword,
  resendAccountActivationToken: resendAccountActivationToken
};
