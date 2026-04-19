const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have difficulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have price"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, "A tour must have summary"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A tour must have desc"],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have image cover"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startDates: {
    type: [Date],
    required: [true, "A tour must have start date"]
  }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
