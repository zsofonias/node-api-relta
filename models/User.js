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
    required: [true, 'User Phone number is required']
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

module.exports = mongoose.model('User', UserSchema);
