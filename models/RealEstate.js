const mongoose = require('mongoose');

const RealEstateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Real-estate name is required'],
    maxlength: [30, 'Real-estate name should be less than 31 Characters'],
    minlength: [7, 'Real-estate name should be more than 6 Characters']
  },
  slug: String,
  summary: {
    type: String,
    required: [true, 'Real-estate summary is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  lotSize: {
    type: Number,
    required: [true, 'Real-estate Lot Size is required']
  },
  bedRoomCount: {
    type: Number,
    required: [true, 'Real-estate bed-room count is required']
  },
  bathRoomCount: {
    type: Number,
    required: [true, 'Real-estate bath-room count is required']
  },
  listingType: {
    type: String,
    enum: ['sell', 'rent'],
    default: 'sell'
  },
  price: {
    type: Number,
    required: [true, 'Real-estate price is required']
  },
  coverImage: {
    type: String,
    required: [true, 'Real-estate cover image is required']
  },
  images: [String],
  location: {
    // GeoJSON data
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  realtor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('RealEstate', RealEstateSchema);
