const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User First-name is required']
  },
  lastName: {
    type: String,
    required: [true, 'User Last-name is required']
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    loadClass: true,
    validate: [validator.isEmail, 'User Email must be Valid Email Address']
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: [true, 'User Phone number is required'],
    validate: [validator.isMobilePhone, 'Valid User Phone-number is required']
  },
  role: {
    type: String,
    enum: ['admin', 'realtor', 'viewer'],
    default: 'viewer'
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minlength: [8, 'Password must be more than 7 Characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password confrimation is required'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Inputed Passwords must match'
    }
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  active: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  accountActivationToken: String,
  accountActivationExpires: Date
});

// model middleware to hash password upon createing new user or updating user password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// method to create account actiavtion token
UserSchema.methods.createAccountActivationToken = function() {
  const activationToken = crypto.randomBytes(32).toString('hex');
  this.accountActivationToken = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');
  this.accountActivationExpires = Date.now() + 10 * 60 * 1000;
  return activationToken;
};

// method to verify user password with the hashed one in the db
UserSchema.methods.verifyPassword = async function(
  inputedPassword,
  userPassword
) {
  return await bcrypt.compare(inputedPassword, userPassword);
};

// method to check if password was changed after token was issued
UserSchema.methods.isPasswordChanged = function(jwtTokenTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTokenTimeStamp < changedTimeStamp;
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);
